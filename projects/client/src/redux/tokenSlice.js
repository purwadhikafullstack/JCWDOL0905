import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: '',
  accessTokenAdmin: ''
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload.accessToken;
    },
    setAccessTokenAdmin:  (state, action) => {
      state.accessTokenAdmin = action.payload.accessTokenAdmin;
    },
  },
});

export const { setAccessToken, setAccessTokenAdmin } = tokenSlice.actions;
export default tokenSlice.reducer;