import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  createTransform,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./authSlice";
import locationReducer from "./locationSlice";

const authTransform = createTransform(
  (inboundState) => {
    if (!inboundState || typeof inboundState !== "object") {
      return inboundState;
    }
    const { loading, error, ...rest } = inboundState;
    return rest;
  },
  (outboundState) => ({
    ...outboundState,
    loading: false,
    error: null,
  }),
  { whitelist: ["auth"] }
);

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
  transforms: [authTransform],
};

const rootReducer = combineReducers({
  auth: authReducer,
  location: locationReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
