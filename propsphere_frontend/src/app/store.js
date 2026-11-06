import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../services/auth.services";
import userreducer from "../features/user.slice";
import { propertyApi } from "../services/properties.services";
import { favoriteApi } from "../services/favorite.services";
import { bookingApi } from "../services/booking.services";

export const store=configureStore({
    reducer:{
        [userApi.reducerPath]:userApi.reducer,
        uReducer:userreducer,
        [propertyApi.reducerPath]:propertyApi.reducer,
        [favoriteApi.reducerPath]: favoriteApi.reducer,
        [bookingApi.reducerPath]:bookingApi.reducer,
    },
    middleware:(getDefaultmiddleware)=>getDefaultmiddleware().concat(userApi.middleware).concat(propertyApi.middleware).concat(favoriteApi.middleware).concat(bookingApi.middleware)
})

export default store;
