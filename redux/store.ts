import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import paymentReducer from "./slices/paymentSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);

export function makeStore() {
  return configureStore({
    reducer: {
      user: persistedUserReducer,
      payment: paymentReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
          ignoredPaths: ["register"],
        },
      }),
  });
}
const store = makeStore();

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
