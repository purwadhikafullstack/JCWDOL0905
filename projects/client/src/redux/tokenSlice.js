import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: ''
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload.accessToken;
    },
  },
});

export const { setAccessToken} = tokenSlice.actions;
export default tokenSlice.reducer;