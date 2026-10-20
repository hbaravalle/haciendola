import { configureStore, createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import authReducer, { login, logout } from "./authSlice";
import { api } from "./api";
import { SESSION_KEY, clearSession, parseSession, saveSession } from "./session";

const sessionChange = createListenerMiddleware();

// Every account has its own catalog, so whenever the session changes the
// cached products belong to someone else: throw them away.
sessionChange.startListening({
  matcher: isAnyOf(login, logout),
  effect: (action, { dispatch }) => {
    dispatch(api.util.resetApiState());
  },
});

// Remember the session across reloads (see session.js).
sessionChange.startListening({
  actionCreator: login,
  effect: (action) => saveSession(action.payload),
});
sessionChange.startListening({
  actionCreator: logout,
  effect: () => clearSession(),
});

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(sessionChange.middleware)
      .concat(api.middleware),
});

// Signing in or out in one tab does the same in the others, so no tab keeps
// showing a catalog whose session ended.
window.addEventListener("storage", (event) => {
  if (event.key !== SESSION_KEY && event.key !== null) return;
  const session = parseSession(event.newValue);
  const { token } = store.getState().auth;
  if (session && session.token !== token) store.dispatch(login(session));
  if (!session && token) store.dispatch(logout());
});

export default store;
