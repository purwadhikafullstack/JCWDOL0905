import { configureStore } from "@reduxjs/toolkit";
import locationSlice from "./locationSlice";
import userSlice from "./userSlice";

export const store = configureStore({
  reducer: {
    locationSlice,
    userSlice,
  },
});
