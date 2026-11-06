
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "./api";

export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/bookings`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("token", token);
      }
      return headers;
    },
  }),
  tagTypes: ["Bookings"],
  endpoints: (builder) => ({
    addBooking: builder.mutation({
      query: (booking) => ({
        url: "/addbooking",
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: booking,
      }),
      invalidatesTags: ["Bookings"],
    }),

    getBookings: builder.query({
      query: () => ({
        url: "/",
        method: "get",
      }),
      providesTags: ["Bookings"],
    }),

    getBookingById: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "get",
      }),
      providesTags: ["Bookings"],
    }),

    getBookingsByBuyer: builder.query({
      query: (buyer) => ({
        url: `/buyer/${buyer}`,
        method: "get",
      }),
      providesTags: ["Bookings"],
    }),

    getBookingsBySeller: builder.query({
      query: (seller) => ({
        url: `/seller/${seller}`,
        method: "get",
      }),
      providesTags: ["Bookings"],
    }),

    deleteBooking: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "delete",
      }),
      invalidatesTags: ["Bookings"],
    }),

    updateBookingStatus: builder.mutation({
      query: ({ id, status, seller }) => ({
        url: `/${id}/status`,
        method: "PATCH",
        body: { status, seller },
      }),
      invalidatesTags: ["Bookings"],
    }),

    cancelBooking: builder.mutation({
      query: ({ id, buyer }) => ({
        url: `/${id}/cancel`,
        method: "PATCH",
        body: { buyer },
      }),
    }),
  }),
});

export const {
  useAddBookingMutation,
  useGetBookingsQuery,
  useGetBookingByIdQuery,
  useGetBookingsByBuyerQuery,
  useLazyGetBookingsByBuyerQuery,
  useLazyGetBookingsBySellerQuery,
  useGetBookingsBySellerQuery,
  useDeleteBookingMutation,
  useUpdateBookingStatusMutation,
  useCancelBookingMutation,
} = bookingApi;
