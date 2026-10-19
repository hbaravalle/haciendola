import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  email: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.email = action.payload.email;
    },
    logout: (state) => {
      state.token = null;
      state.email = null;
    },
    recover: (state, action) => {
      state.email = action.payload.email;
    },
    setOtp: (state, action) => {
      state.otp = action.payload.otp;
    },
  },
});

export const { login, logout, recover, setOtp } = authSlice.actions;
export default authSlice.reducer;
