import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from './config/basequeary';
import { AssignRoleRequest, RemoveRoleRequest, RoleResponse } from '../type/auth_role';



const baseUrl = 'https://localhost:7141/api';  // Adjust base URL as needed

export const roleAndUserApi = createApi({
  reducerPath: 'roleApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Roles', 'FilteredTasks'],
  endpoints: (builder) => ({
    getRoles: builder.query<RoleResponse, number | null>({
      query: (projectId) => '/roles',  // Adjust endpoint as needed
      providesTags: ['Roles'],
    }),
    assignRole: builder.mutation<RoleResponse, AssignRoleRequest>({
      query: (assignRoleRequest) => ({
        url: '/roles/assign',
        method: 'POST',
        body: assignRoleRequest,
      }),
      invalidatesTags: ['Roles','FilteredTasks'],
    }),
    removeRole: builder.mutation<RoleResponse, RemoveRoleRequest>({
      query: (removeRoleRequest) => ({
        url: '/roles/remove',
        method: 'DELETE',
        body: removeRoleRequest,
      }),
      invalidatesTags: ['Roles','FilteredTasks'],
      
    }),
  }),
});

export const { useGetRolesQuery, useAssignRoleMutation, useRemoveRoleMutation } = roleAndUserApi;