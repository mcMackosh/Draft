import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from './config/basequeary';
import {
  CreateProjectDto,
  UpdateProjectDto,
  ProjectsResponse,
  OneProjectResponse,
  ProjectDto
} from '../type/project';

export const projectApi = createApi({
  reducerPath: 'projectApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Project'],
  endpoints: (builder) => ({
    createProject: builder.mutation<OneProjectResponse, CreateProjectDto>({
      query: (project) => ({
        url: 'projects',
        method: 'POST',
        body: project,
      }),
      invalidatesTags: [{ type: 'Project', id: 'LIST' }],
    }),

    updateProject: builder.mutation<OneProjectResponse, { id: number; data: UpdateProjectDto }>({
      query: ({ id, data }) => ({
        url: `projects/?projectId=${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Project', id },
        { type: 'Project', id: 'LIST' },
      ],
    }),

    deleteProject: builder.mutation<void, number>({
      query: (id) => ({
        url: `projects`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Project', id },
        { type: 'Project', id: 'LIST' },
      ],
    }),

    getProject: builder.query<OneProjectResponse, number>({
      query: (id) => `projects`,
      providesTags: (result, error, id) => [{ type: 'Project', id }],
    }),

    getUserProjects: builder.query<ProjectsResponse, void>({
              query: () => 'projects/all',
              providesTags: (result) =>
                result && result.data
                  ? [
                      { type: 'Project' as const, id: 'LIST' },
                      ...result.data.map((project: ProjectDto) => ({ type: 'Project' as const, id: project.id })),
                    ]
                  : [{ type: 'Project' as const, id: 'LIST' }],
          }),
  }),
});

export const {
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectQuery,
  useLazyGetProjectQuery,
  useGetUserProjectsQuery,
} = projectApi;