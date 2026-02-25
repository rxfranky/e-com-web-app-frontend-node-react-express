import { createSlice } from '@reduxjs/toolkit'


const showSlice = createSlice({
    name: 'show',
    initialState: { showHamberger: false, showProfile: false },
    reducers: {
        handleShowHamberger: (state, action) => {
            state.showHamberger = action.payload
        },
        handleShowProfile: (state, action) => {
            state.showProfile = action.payload
        }
    }
})

export const { handleShowHamberger, handleShowProfile } = showSlice.actions
export default showSlice.reducer