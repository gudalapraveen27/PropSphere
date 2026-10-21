import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../services/registrationApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import userReducer from "../components/auth/userSlice";
import { propertyApi } from "../services/propertyApi";

export const store = configureStore({
    reducer: {
        uReducer: userReducer,
        [userApi.reducerPath]: userApi.reducer,
        [propertyApi.reducerPath]: propertyApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userApi.middleware, propertyApi.middleware)
});



setupListeners(store.dispatch);