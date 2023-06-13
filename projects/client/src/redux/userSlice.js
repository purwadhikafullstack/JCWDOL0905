import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: 0,
  name: "",
  email: "",
  is_verified: 0,
  profile_picture: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.id = action.payload.id;
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.is_verified = action.payload.is_verified;
      state.profile_picture = action.payload.profile_picture;
    },
    logout: (state) => {
      state.id = 0;
      state.name = "";
      state.email = "";
      state.is_verified = 0;
      state.profile_picture = "";
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
