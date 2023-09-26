import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ACCESS_TOKEN_KEY } from '../utils/const';
import { headers } from './headers';

const URL_PATH_PREFIX = '/users';

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
        url: `${URL_PATH_PREFIX}/login`,
        method: 'POST',
        body
      }),
      transformResponse: (response: LoginResponse) => {
        localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);

        return response;
      }
    }),
    logout: builder.query<unknown, void>({
      query: (body) => ({
        url: `${URL_PATH_PREFIX}/logout`,
        method: 'POST',
        headers,
        body
      }),
      transformResponse: () => {
        // TODO: Logout Endpunkt sollte nicht 2x aufgerufen werden können
        // localStorage.setItem(ACCESS_TOKEN_KEY, '');
      }
    })
  })
});

export const { useLazyLoginQuery, useLazyLogoutQuery } = userApi;
