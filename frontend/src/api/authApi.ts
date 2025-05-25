import {
  createApi,
} from '@reduxjs/toolkit/query/react';
import { LoginRequest, LoginResponse, RegisterRequest, OnlyUserDataResponse, VerifyRequest } from '../type/auth_role';
import baseQueryWithReauth from './config/basequeary';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (loginRequest) => ({
        url: 'auth/login',
        method: 'POST',
        body: loginRequest,
      }),
    }),
    logout: builder.mutation<string, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'DELETE',
      }),
    }),
    registration: builder.mutation<OnlyUserDataResponse, RegisterRequest>({
      query: (regRequest) => ({
        url: 'auth/register',
        method: 'POST',
        body: regRequest,
      }),
    }),
    verify: builder.mutation<LoginResponse, VerifyRequest>({
      query: (verifyRequest) => ({
        url: '/auth/verify',
        method: 'POST',
        body: verifyRequest,
      }),
    }),
    refresh: builder.mutation<LoginResponse, number>({
      query: (projectId) => ({
        url: `auth/refresh${projectId ? `?projectId=${projectId}` : ''}`,
        method: 'POST',
      }),
    }),
    getUser: builder.query<OnlyUserDataResponse, void>({
      query: () => "/auth/me",
    }),
  }),
});

export const { 
  useLoginMutation, 
  useLogoutMutation, 
  useRegistrationMutation, 
  useVerifyMutation, 
  useRefreshMutation,
  useGetUserQuery
} = authApi;