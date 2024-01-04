import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signInStart: (state) => {
            state.error = null;
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        userUpdateStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        userUpdateSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
            state.error = null;
        },
        userUpdateFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        userDeleteSuccess: (state) => {
            state.loading = false;
            state.error = null;
            state.currentUser = null;
        },
        userDeleteFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    signInStart,
    signInSuccess,
    signInFailure,
    userUpdateFailure,
    userUpdateSuccess,
    userUpdateStart,
    userDeleteFailure,
    userDeleteSuccess,
} = userSlice.actions;

export default userSlice.reducer;
