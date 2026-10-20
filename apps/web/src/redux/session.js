// Keeps the session in localStorage so a reload doesn't sign the user out.
// An httpOnly cookie would keep the token away from scripts, but the web app
// and the API live on different vercel.app subdomains, where browsers block
// that cookie as third-party. Sessions last 24 hours at most (7 days for the
// demo), and the API checks the token on every request anyway.

export const SESSION_KEY = "haciendola.session";

// When the token stops working, read from the token itself: the demo's
// session has no account expiry, but every token has an `exp`.
function tokenExpiresAt(token) {
  const payload = token.split(".")[1];
  const { exp } = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  return exp * 1000;
}

// Turns a stored value into a session, or null when there's none, it can't be
// read, or its token has expired.
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

// Storage can be blocked (some private windows, or site data turned off); the
// app then works as before and only forgets the session on reload.
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
    // Not stored: the session lasts until the tab is reloaded.
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Nothing was stored.
  }
}
