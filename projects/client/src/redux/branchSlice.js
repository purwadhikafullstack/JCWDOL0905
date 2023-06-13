import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  branchId: 0,
};

export const branchSlice = createSlice({
  name: "branch",
  initialState,
  reducers: {
    setBranchId: (state, action) => {
      state.branchId = action.payload.branchId;
    },
  },
});

export const { setBranchId } = branchSlice.actions;
export default branchSlice.reducer;
