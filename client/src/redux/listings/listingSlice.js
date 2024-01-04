import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    ListingData: null,
    ListingError: null,
    ListingLoading: false,
}

const listingSlice = createSlice({
    name: "listing",
    initialState,
    reducers: {
        loadStart : (state) => {
            state.ListingLoading = true;
            state.ListingError = null;
        },
        loadSuccess: (state, action) => {
            state.ListingLoading = false;
            state.ListingData = action.payload;
            state.ListingError = null;
        },
        loadFailure: (state, action) => {
            state.ListingLoading = false;
            state.ListingData = null;
            state.ListingError = action.payload;
        }
    },
});

export const {
    loadStart,
    loadFailure,
    loadSuccess
} = listingSlice.actions;

export default listingSlice.reducer
