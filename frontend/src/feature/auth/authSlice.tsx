import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      console.log("action.payload", action.payload);
      state.token = action.payload.accessToken;
    },
    logOut: (state) => {
      state.token = null;
    },
  },
});


export const { setCredentials, logOut } = authSlice.actions;


export const selectCurrentToken = (state: any) => state.auth.token;


export default authSlice.reducer;
