import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/propsphere" }),
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (userData) => ({
                url: "/register",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: userData
            })
        }),
        loginUser: builder.mutation({
            query: (loginData) => ({
                url: "/login",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: loginData
            })
        }),
        getUserById: builder.query({
            query: (id) => ({
                url: `/getUserById/${id}`,
                method: "GET",
            }),
        }),
    })
});


export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useGetUserByIdQuery
} = userApi;