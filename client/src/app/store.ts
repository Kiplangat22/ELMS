import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { usersAPI } from "../features/auth/userAPI";
import { loginAPI } from "../features/auth/LoginAPI";
import { leaveTypeAPI } from "../features/leave/leaveTypeAPI"; 
import { leaveRequestAPI } from "../features/leave/LeaveRequestAPI"; 
import userSlice from "../features/auth/userSlice";
import { departmentAPI } from "../features/departments/departmentAPI";
import { leaveBalanceAPI } from "../features/leave/leaveBalanceAPI";


const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["user"], // Changed from "userAPI" to "user"
};

// Combine all reducers into one root reducer
const rootReducer = combineReducers({
  [usersAPI.reducerPath]: usersAPI.reducer,
  [loginAPI.reducerPath]: loginAPI.reducer,
  [leaveTypeAPI.reducerPath]: leaveTypeAPI.reducer, 
  [leaveRequestAPI.reducerPath]: leaveRequestAPI.reducer,
  [departmentAPI.reducerPath]: departmentAPI.reducer,
  [leaveBalanceAPI.reducerPath]: leaveBalanceAPI.reducer, 
  user: userSlice,
});

// Wrap rootReducer with persistReducer
export const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }).concat(
      usersAPI.middleware, 
      loginAPI.middleware,
      leaveTypeAPI.middleware,
      leaveRequestAPI.middleware,
      departmentAPI.middleware,
      leaveBalanceAPI.middleware
    ),
});

// Create persisted store
export const persistedStore = persistStore(store);
export type RootState = ReturnType<typeof rootReducer>;