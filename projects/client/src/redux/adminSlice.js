import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: 0,
    admin_name: "",
    email: "",
    id_branch: "",
    role: "",
}

export const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        loginAdmin: (state, action) => {
            state.id = action.payload.id;
            state.admin_name = action.payload.admin_name;
            state.email = action.payload.email;
            state.id_branch = action.payload.id_branch;
            state.role = action.payload.role
        },
        logoutAdmin: (state, action) => {
            state.id = 0;
            state.admin_name = "";
            state.email = "";
            state.id_branch = "";
            state.role = ""
        },
    }
})

export const { loginAdmin, logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;