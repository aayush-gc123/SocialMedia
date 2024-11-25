import { configureStore } from "@reduxjs/toolkit"; // Remove .js from the import
import { combineReducers } from 'redux'; // Import combineReducers from 'redux'
import authSlice from "./authSlice"; // Assuming authSlice is the correct path
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Storage import is correct

// Define the persist config
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

// Combine all reducers (add other slices as needed)
const rootReducer = combineReducers({
  auth: authSlice,
  // Add other reducers here like post: postSlice, socketio: socketSlice, etc.
});

// Apply the persistReducer to the rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
