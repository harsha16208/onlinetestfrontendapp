import { createStore } from "redux";
import {rootReducer} from "./reducers/RootReducer"
import { persistStore, persistReducer } from  "redux-persist"
import storage from "redux-persist/lib/storage"


const persistConfig = {
    key : "persist",
    storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const Store = createStore(persistedReducer)
export const persistor = persistStore(Store)