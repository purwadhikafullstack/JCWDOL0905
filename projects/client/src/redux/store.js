import { configureStore } from "@reduxjs/toolkit";
import locationSlice from "./locationSlice";
import userSlice from "./userSlice";
import branchSlice from "./branchSlice";
import tokenSlice from "./tokenSlice"
import branchSlice from "./branchSlice";
import cartSlice from "./cartSlice";

export const store = configureStore({
  reducer: {
    locationSlice,
    userSlice,
    branchSlice,
    tokenSlice,
    cartSlice
  }
});
