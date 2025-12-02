// // src/store/store.ts
// import { combineReducers, configureStore } from '@reduxjs/toolkit'
// import { persistReducer, persistStore } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'
// // import tokenExpirationMiddleware from '../utils/tokenExpiryMiddleware'

// // // Import your API slices
// // import { authAPI } from '../features/auth/authAPI'
// // import { leaveAPI } from '../features/leave/leaveAPI'
// // import { employeeAPI } from '../features/employee/employeeAPI'

// // // Import your regular slices
// // import authSlice from '../features/auth/authSlice'
// // import leaveSlice from '../features/leave/leaveSlice'

// const persistConfig = {
//     key: 'elms-root', 
//     version: 1, 
//     storage, 
//     whitelist: ['auth', 'leave'] 
// }

// // Combining all reducers into one root reducer
// // const rootReducer = combineReducers({
// //     [authAPI.reducerPath]: authAPI.reducer,
// //     [leaveAPI.reducerPath]: leaveAPI.reducer,
// //     [employeeAPI.reducerPath]: employeeAPI.reducer,
// //     auth: authSlice,
// //     leave: leaveSlice
// // })

// // Wrap combined reducers with persistReducer to enable persistence in local storage
// const persistedReducer = persistReducer(persistConfig, rootReducer)

// export const store = configureStore({
//     reducer: persistedReducer, 
//     middleware: (getDefaultMiddleware) => getDefaultMiddleware({
//         serializableCheck: false 
//     })
//         // .concat(authAPI.middleware) 
//         // .concat(leaveAPI.middleware)
//         // .concat(employeeAPI.middleware) 
//         // .concat(tokenExpirationMiddleware) 
// })

// export const persistedStore = persistStore(store) 
// export type RootState = ReturnType<typeof store.getState> 
// export type AppDispatch = typeof store.dispatch 