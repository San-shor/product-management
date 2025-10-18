import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.bitechx.com',
  }),
  endpoints: (builder) => ({
    getAuthToken: builder.mutation<{ token: string }, string>({
      query: (email) => ({
        url: '/auth',
        method: 'POST',
        body: { email },
      }),
    }),
  }),
});

export const { useGetAuthTokenMutation } = authApi;
