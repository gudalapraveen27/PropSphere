
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const propertyApi = createApi({
    reducerPath: 'propertyApi',

    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:4000/propsphere/property',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token')
            if (token) {
                headers.set('token', `${token}`)
                headers.set('Content-Type', 'application/json')
            }
            return headers
        }
    }),

    endpoints: (builder) => ({
        getProperties: builder.query({
            query: () => ({
                url: '/',
                method: 'GET',
            }),
        }),

        getPropertyById: builder.query({
            query: (id) => `/${id}`,
        }),

        createProperty: builder.mutation({
            query: (property) => ({
                url: '/',
                method: 'POST',
                body: property,
            }),
        }),
    }),
})

export const {
    useGetPropertiesQuery,
    useGetPropertyByIdQuery,
    useCreatePropertyMutation,
    useLazyGetPropertiesQuery,
} = propertyApi
