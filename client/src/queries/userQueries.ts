import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Cookies } from 'react-cookie';
import jwtDecode from 'jwt-decode';
import { assertTrue } from '../utils/assert';
import { isAccessToken } from '../utils/types';

const COOKIE_NAME = 'Finence';

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
        const decodedToken = jwtDecode(response.accessToken);
        assertTrue(isAccessToken(decodedToken));

        const expires = new Date(decodedToken.exp * 1000);
        const cookies = new Cookies();
        cookies.set(COOKIE_NAME, response.accessToken, { path: '/', expires });

        return response;
      }
    })
  })
});

export const { useLazyLoginQuery } = userApi;
