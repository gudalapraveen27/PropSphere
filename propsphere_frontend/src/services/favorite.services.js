
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./api";

export const favoriteApi = createApi({
  reducerPath: "favoriteApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/favorite`,
  }),
  endpoints: (builder) => ({
    addFavorite: builder.mutation({
      query: (favorite) => ({
        url: "/",
        method: "POST",
        headers: {
          "content-type": "application/json",
          token: window.localStorage.getItem("token"),
        },
        body: favorite,
      }),
    }),

    getFavorites: builder.query({
      query: (user) => ({
        url: "/",
        method: "GET",
        headers: {
          "content-type": "application/json",
          token: window.localStorage.getItem("token"),
        },
        params: { user },
      }),
    }),

    deleteFavorite: builder.mutation({
      query: (favorite) => ({
        url: "/deletefavorite",
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          token: window.localStorage.getItem("token"),
        },
        body: favorite,
      }),
    }),
  }),
});

export const {
  useAddFavoriteMutation,
  useGetFavoritesQuery,
  useLazyGetFavoritesQuery,
  useDeleteFavoriteMutation,
} = favoriteApi;
