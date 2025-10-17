// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Product } from '@/types/product';

// Define a service using a base URL and expected endpoints
export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.bitechx.com',
    prepareHeaders: (headers, { getState }) => {
      // Get token from Redux state
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query<
      Product[],
      { offset?: number; limit?: number; searchedText?: string }
    >({
      query: ({ offset, limit, searchedText }) => {
        const params = new URLSearchParams();
        if (offset !== undefined) params.set('offset', String(offset));
        if (limit !== undefined) params.set('limit', String(limit));
        if (searchedText && searchedText.trim().length > 0) {
          params.set('searchedText', searchedText.trim());
        }

        const qs = params.toString();
        const base =
          searchedText && searchedText.trim().length > 0
            ? '/products/search'
            : '/products';
        const url = qs ? `${base}?${qs}` : base;

        return url;
      },
      providesTags: ['Product'],
    }),
    deleteProduct: builder.mutation<{ id: string }, string>({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const { useGetProductsQuery, useDeleteProductMutation } = productApi;
