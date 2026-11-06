import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./api";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/user` }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (user) => ({
        url: "/register",
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: user,
      }),
    }),
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "post",
        body: data,
        headers: {
          "content-type": "application/json",
        },
      }),
    }),
    getuserbyid: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "get",
      }),
    }),
    updateUser: builder.mutation({
      query: ({ id, ...user }) => ({
        url: `/update/${id}`,
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: user,
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetuserbyidQuery,
  useLazyGetuserbyidQuery,
  useUpdateUserMutation,
} = userApi;
