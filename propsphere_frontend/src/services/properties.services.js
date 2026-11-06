import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./api";

export const propertyApi = createApi({
  reducerPath: "propertyApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/property` }),
  endpoints: (builder) => ({
    addProperty: builder.mutation({
      query: (property) => {
        const formData = new FormData();

        formData.append("propertyData", JSON.stringify(property.propertyData));

        property.images.forEach((image) => {
          formData.append("images", image);
        });

        return {
          url: "/addproperty",
          method: "POST",
          headers: {
            token: localStorage.getItem("token"),
          },
          body: formData,
        };
      },
    }),

    getAllProperties: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
        headers: {
          "content-type": "application/json",
          token: window.localStorage.getItem("token"),
        },
      }),
    }),

    filterProperties: builder.query({
      query: (params) => ({
        url: "/filterproperty",
        method: "GET",
        headers: {
          "content-type": "application/json",
          token: window.localStorage.getItem("token"),
        },
        params,
      }),
    }),

    deleteProperty: builder.mutation({
      query: ({ property, id }) => ({
        url: "/deleteproperty",
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          token: window.localStorage.getItem("token"),
        },
        params: { property, id },
      }),
    }),

    updateProperty: builder.mutation({
      query: (property) => ({
        url: "/updateproperty",
        method: "PUT",
        headers: {
          "content-type": "application/json",
          token: window.localStorage.getItem("token"),
        },
        body: { property },
      }),
    }),
  }),
});

export const {
  useAddPropertyMutation,
  useGetAllPropertiesQuery,
  useFilterPropertiesQuery,
  useLazyFilterPropertiesQuery,
  useLazyGetAllPropertiesQuery,
  useDeletePropertyMutation,
  useUpdatePropertyMutation,
} = propertyApi;
