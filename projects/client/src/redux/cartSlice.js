import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    countItem: (state, action) => {
      state.count = action.payload.count;
    },
  },
});

export const { countItem } = cartSlice.actions;
export default cartSlice.reducer;
