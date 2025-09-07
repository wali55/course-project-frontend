import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import inventoriesReducer from "./slices/inventoriesSlice";
import accessControlReducer from "./slices/accessControlSlice";
import customFieldsReducer from "./slices/customFieldsSlice";
import idFormatReducer from "./slices/idFormatSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    inventories: inventoriesReducer,
    accessControl: accessControlReducer,
    customFields: customFieldsReducer,
    idFormat: idFormatReducer
  },
});
