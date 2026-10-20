import { configureStore, createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import authReducer, { login, logout } from "./authSlice";
import { api } from "./api";

// Every account has its own catalog, so whenever the session changes the
// cached products belong to someone else: throw them away.
const sessionChange = createListenerMiddleware();
sessionChange.startListening({
  matcher: isAnyOf(login, logout),
  effect: (action, { dispatch }) => {
    dispatch(api.util.resetApiState());
  },
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

export default store;
