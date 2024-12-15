import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

console.log('Initializing Redux store...');

// ==============================|| REDUX - MAIN STORE ||============================== //

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false
    })
});

console.log('Store initialized:', store.getState());

export { store };
