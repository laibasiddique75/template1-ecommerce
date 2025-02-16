import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import { cartSlice } from './feature/cartSlice'; // Ensure cartSlice is correctly imported

// Persist Config
// const persistConfig = {
//   key: "root",
//   version: 1,
//   storage:"redux-persist failed to create sync storage. falling back to noop storage",
// };



import storageSession from 'redux-persist/lib/storage/session';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: storageSession, // ✅ Use sessionStorage instead of localStorage
};


// Combine Reducers
const rootReducer = combineReducers({
  cart: cartSlice.reducer, // Fixed: Using `.reducer`
});

// Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store Configuration
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// Persistor
export const persistor = persistStore(store);

// Infer the `RootState`, `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

