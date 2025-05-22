import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
    },
    logOut: (state) => {
      state.token = null;
    },
  },
});

export default authSlice.reducer;
