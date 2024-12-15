import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// reducers
import customizationReducer from './customizationReducer';
import snackbarReducer from './snackbarReducer';
import authReducer from './authReducer';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducer = combineReducers({
  customization: customizationReducer,
  snackbar: snackbarReducer,
  auth: authReducer
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['customization', 'auth'] // only these will be persisted
};

export default persistReducer(persistConfig, reducer);
