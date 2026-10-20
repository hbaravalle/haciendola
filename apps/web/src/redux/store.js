import { configureStore, createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import authReducer, { login, logout } from "./authSlice";
import { api } from "./api";
import { SESSION_KEY, clearSession, parseSession, saveSession } from "./session";

const sessionChange = createListenerMiddleware();

// Each account has its own catalog: drop the cache when the session changes.
sessionChange.startListening({
  matcher: isAnyOf(login, logout),
  effect: (action, { dispatch }) => {
    dispatch(api.util.resetApiState());
  },
});

// Persist the session (see session.js).
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

// Sync sign-in and sign-out across tabs.
window.addEventListener("storage", (event) => {
  if (event.key !== SESSION_KEY && event.key !== null) return;
  const session = parseSession(event.newValue);
  const { token } = store.getState().auth;
  if (session && session.token !== token) store.dispatch(login(session));
  if (!session && token) store.dispatch(logout());
});

export default store;
