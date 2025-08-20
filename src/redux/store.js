import { configureStore } from "@reduxjs/toolkit";
import recipientsReducer from "./slice/recipientsSlice";
import itemsReducer from "./slice/itemsSlice";
import pendingReducer from "./slice/pendingBillsSlice";
import storage from "redux-persist/lib/storage"; // localStorage
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  recipients: recipientsReducer,
  items: itemsReducer,
  pending:pendingReducer

});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
