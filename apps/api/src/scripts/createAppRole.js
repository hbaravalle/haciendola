// Creates (or rotates) the API's database role: rows only, no schema changes.
// Usage: node src/scripts/createAppRole.js [--write-env], once per Neon branch.
import "dotenv/config";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { Client } from "pg";

const ROLE = "haciendola_app";
const ENV_FILE = path.join(import.meta.dirname, "../../.env");

async function createAppRole() {
  const adminUrl = process.env.DATABASE_ADMIN_URL || process.env.DATABASE_URL;
  const client = new Client({ connectionString: adminUrl });
  await client.connect();

  const owner = (await client.query("select current_user")).rows[0].current_user;
  if (owner === ROLE) {
    throw new Error(`Connected as ${ROLE}. Set DATABASE_ADMIN_URL to the owner's connection string.`);
  }

  const password = crypto.randomBytes(24).toString("base64url");
  const exists = (await client.query("select 1 from pg_roles where rolname = $1", [ROLE])).rowCount;
  // Identifiers and passwords can't be bind parameters.
  const quotedPassword = `'${password.replace(/'/g, "''")}'`;
  await client.query(
    exists
      ? `alter role ${ROLE} with login password ${quotedPassword}`
      : `create role ${ROLE} with login password ${quotedPassword}`
  );

  const db = (await client.query("select current_database()")).rows[0].current_database;
  await client.query(`grant connect on database "${db}" to ${ROLE}`);
  await client.query(`grant usage on schema public to ${ROLE}`);
  await client.query(`grant select, insert, update, delete on all tables in schema public to ${ROLE}`);
  await client.query(`grant usage, select on all sequences in schema public to ${ROLE}`);
  // Keep the grants when db:init recreates the tables.
  await client.query(
    `alter default privileges for role ${owner} in schema public grant select, insert, update, delete on tables to ${ROLE}`
  );
  await client.query(
    `alter default privileges for role ${owner} in schema public grant usage, select on sequences to ${ROLE}`
  );
  await client.end();

  const appUrl = new URL(adminUrl);
  appUrl.username = ROLE;
  appUrl.password = password;
  console.log(`[Role] ${exists ? "Rotated the password of" : "Created"} ${ROLE} on ${db}`);

  if (process.argv.includes("--write-env")) {
    writeEnv(adminUrl, appUrl.toString());
    console.log("[Role] .env updated: DATABASE_URL uses the new role, DATABASE_ADMIN_URL the owner");
  } else {
    console.log("[Role] Rerun with --write-env to save it in .env, or set DATABASE_URL to:");
    console.log(appUrl.toString());
  }
}

// DATABASE_URL → new role, DATABASE_ADMIN_URL → owner.
function writeEnv(adminUrl, appUrl) {
  let env = fs.readFileSync(ENV_FILE, "utf8");
  const set = (key, value) => {
    const line = `${key}=${value}`;
    const pattern = new RegExp(`^${key}=.*$`, "m");
    env = pattern.test(env) ? env.replace(pattern, () => line) : env.replace(/^(DATABASE_URL=.*)$/m, (m) => `${m}\n${line}`);
  };
  set("DATABASE_URL", appUrl);
  set("DATABASE_ADMIN_URL", adminUrl);
  fs.writeFileSync(ENV_FILE, env);
}

createAppRole().catch((err) => {
  console.error("[Role]", err.message);
  process.exit(1);
});
