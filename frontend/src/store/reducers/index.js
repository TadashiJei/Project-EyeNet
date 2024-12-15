import { combineReducers } from '@reduxjs/toolkit';
import customizationReducer from './customization';

const reducer = combineReducers({
  customization: customizationReducer
});

export default reducer;
