import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    usrLat: "",
    usrLng: "",
    usrLocation: "",
  },
};

export const locationSlice = createSlice({
  name: "userLocation",
  initialState,
  reducers: {
    setUsrLocation: (state, action) => {
      state.value.usrLat = action.payload.usrLat;
      state.value.usrLng = action.payload.usrLng;
      state.value.usrLocation = action.payload.usrLocation;
    },
  },
});

export const { setUsrLocation } = locationSlice.actions;
export default locationSlice.reducer;
