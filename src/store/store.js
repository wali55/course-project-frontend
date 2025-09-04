import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import inventoriesReducer from './slices/inventoriesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    inventories: inventoriesReducer
  },
});