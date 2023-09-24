import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ACCESS_TOKEN_KEY } from '../utils/const';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
}

export const userApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.SERVER_BASE_URL }),
  endpoints: (builder) => ({
    login: builder.query<LoginResponse, LoginPayload>({
      query: (body) => ({
        url: '/users/login',
        method: 'POST',
        body
      }),
      transformResponse: (response: LoginResponse) => {
        localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);

        return response;
      }
    })
  })
});

export const { useLazyLoginQuery } = userApi;
