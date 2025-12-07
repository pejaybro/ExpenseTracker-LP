import { configureStore } from "@reduxjs/toolkit";
// defaults to localStorage
import { combineReducers } from "redux";

import budgetReducer from "@/redux/slices/budget-slice.js";
import totalReducer from "@/redux/slices/total-slice.js";
import MinMaxReducer from "@/redux/slices/minmax-slice.js";
import transactionReducer from "@/redux/slices/transaction-slice.js";
import tripReducer from "@/redux/slices/trip-slice.js";
import userReducer from "@/redux/slices/user-slice.js";
import filterReducer from "@/redux/slices/filter-slice.js";
import NotificationReducer from "@/redux/slices/notification-slice.js";

import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const tripPersistConfig = {
  key: "trip",
  storage,
  whitelist: ["TripFlags"], // <-- only this state key will be persisted
};
const persistedTripReducer = persistReducer(tripPersistConfig, tripReducer);

const notifucationPersistConfig = {
  key: "notifications",
  storage,
  whitelist: ["RecurringNotifications", "RecurringDataHash"], // <-- only this state key will be persisted
};
const persistedNotoficationReducer = persistReducer(
  notifucationPersistConfig,
  NotificationReducer,
);

export const rootReducer = combineReducers({
  budget: budgetReducer,
  MM: MinMaxReducer,
  total: totalReducer,
  transaction: transactionReducer,
  trip: persistedTripReducer,
  user: userReducer,
  filter: filterReducer,
  notifications: persistedNotoficationReducer,
});

// Configure store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ignore redux-persist action types for serializable middleware
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
