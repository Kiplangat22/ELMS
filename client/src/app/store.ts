import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { usersAPI } from "../features/auth/userAPI";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["userAPI"], 
};

// Combine all reducers into one root reducer
const rootReducer = combineReducers({
  [usersAPI.reducerPath]: usersAPI.reducer,
});

// Wrap rootReducer with persistReducer
export const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }).concat(usersAPI.middleware),
});

// Create persisted store
export const persistedStore = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
