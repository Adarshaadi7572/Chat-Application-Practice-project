import {createSlice} from '@reduxjs/toolkit';
export const logSlice = createSlice({
    name: 'logSlice',
   initialState:true,
    reducers: {
      stateLogin : (state) => {
        return !state;
      }
    }
});
export const {toggleState} = logSlice.actions;
export default logSlice.reducer;