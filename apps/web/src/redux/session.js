// Session in localStorage. An httpOnly cookie won't do: across the two
// vercel.app subdomains, browsers block it as third-party.

export const SESSION_KEY = "haciendola.session";

// From the JWT's `exp` (the demo has no account expiry).
function tokenExpiresAt(token) {
  const payload = token.split(".")[1];
  const { exp } = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  return exp * 1000;
}

// The stored session, or null if missing, unreadable or expired.
export function parseSession(raw) {
  try {
    const session = JSON.parse(raw);
    if (!session?.token || !session.email) return null;
    if (tokenExpiresAt(session.token) <= Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

// Storage may be blocked; then the session just won't survive a reload.
export function loadSession() {
  try {
    return parseSession(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

export function saveSession({ token, email, accountExpiresAt }) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ token, email, accountExpiresAt }));
  } catch {
    // Not saved: the session ends on reload.
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Nothing was stored.
  }
}
