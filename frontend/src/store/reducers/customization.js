import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDarkMode: false,
  isOpen: [], // for active default menu
  defaultId: 'default',
  fontFamily: `'Inter', sans-serif`,
  borderRadius: 12,
  opened: true
};

const customization = createSlice({
  name: 'customization',
  initialState,
  reducers: {
    setMode: (state, action) => {
      state.isDarkMode = action.payload;
    },
    menuOpen: (state, action) => {
      const id = action.payload;
      state.isOpen = [id];
    },
    setMenu: (state, action) => {
      state.opened = action.payload;
    }
  }
});

export const { setMode, menuOpen, setMenu } = customization.actions;
export default customization.reducer;
