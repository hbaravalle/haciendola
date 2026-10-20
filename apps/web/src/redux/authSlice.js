import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  email: null,
  // When the account and its catalog are deleted (ISO date), null for the demo.
  accountExpiresAt: null,
  // Email the login code was sent to, carried from one login step to the next.
  pendingEmail: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.accountExpiresAt = action.payload.accountExpiresAt ?? null;
      state.pendingEmail = null;
    },
    logout: () => initialState,
    setPendingEmail: (state, action) => {
      state.pendingEmail = action.payload;
    },
  },
});

export const { login, logout, setPendingEmail } = authSlice.actions;
export default authSlice.reducer;
