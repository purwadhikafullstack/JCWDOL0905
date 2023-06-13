import { configureStore } from "@reduxjs/toolkit";
import locationSlice from "./locationSlice";
import userSlice from "./userSlice";
import branchSlice from "./branchSlice";

export const store = configureStore({
  reducer: {
    locationSlice,
    userSlice,
    branchSlice
  },
});
