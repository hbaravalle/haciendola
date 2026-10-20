import { createSlice } from "@reduxjs/toolkit";
import { loadSession } from "./session";

const signedOut = {
  token: null,
  email: null,
  // When the account and its catalog are deleted (ISO date), null for the demo.
  accountExpiresAt: null,
  // Email the login code was sent to, carried from one login step to the next.
  pendingEmail: null,
};

const authSlice = createSlice({
  name: "auth",
  // A session saved before the last reload, if it's still valid.
  initialState: () => ({ ...signedOut, ...loadSession() }),
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.accountExpiresAt = action.payload.accountExpiresAt ?? null;
      state.pendingEmail = null;
    },
    logout: () => signedOut,
    setPendingEmail: (state, action) => {
      state.pendingEmail = action.payload;
    },
  },
});

export const { login, logout, setPendingEmail } = authSlice.actions;
export default authSlice.reducer;
