import { createSlice } from "@reduxjs/toolkit";
import { loadSession } from "./session";

const signedOut = {
  token: null,
  email: null,
  // When the account is deleted (ISO date); null for the demo.
  accountExpiresAt: null,
  // Email waiting for its code, between the login steps.
  pendingEmail: null,
};

const authSlice = createSlice({
  name: "auth",
  // Restore a still-valid saved session.
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
