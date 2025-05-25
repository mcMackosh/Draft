import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from './config/basequeary';
import { 
  GetTasksParams, 
  TaskCreateDto, 
  TaskDto, 
  TaskUpdateDto, 
  UserWithTasks,
  TaskResponse,
  TasksByDateResponse,
  UserWithTasksResponse,
  TaskListResponse,
  TaskDtoResponse
} from '../type/task';

export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['FilteredTasks', 'Task'],
  endpoints: (builder) => ({
    getFilteredTasks: builder.query<UserWithTasksResponse, GetTasksParams>({
      query: ({ projectId, filters }) => ({
        url: `tasks/all`,
        method: 'POST',
        params: {
          projectId: projectId.toString(),
        },
        body: filters,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Task' as const, id })),
              { type: 'FilteredTasks', id: 'LIST' },
            ]
          : ['FilteredTasks'],
    }),

    createTask: builder.mutation<TaskResponse, TaskCreateDto & { projectId: number }>({
      query: (taskDto) => ({
        url: '/tasks',
        method: 'POST',
        body: taskDto,
      }),
      invalidatesTags: [{ type: 'FilteredTasks', id: 'LIST' }],
    }),

    updateTask: builder.mutation<TaskResponse, { taskId: number; taskDto: TaskUpdateDto & { projectId: number } }>({
      query: ({ taskId, taskDto }) => ({
        url: '/tasks',
        method: 'PUT',
        params: { taskId },
        body: taskDto,
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: 'Task', id: taskId },
        { type: 'FilteredTasks', id: 'LIST' },
      ],
    }),

    updateFragmentTask: builder.mutation<TaskResponse, { taskId: number; taskDto: Partial<TaskUpdateDto> & { projectId: number } }>({
      query: ({ taskId, taskDto }) => ({
        url: '/tasks/fragment',
        method: 'PUT',
        params: { taskId },
        body: taskDto,
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: 'Task', id: taskId },
        { type: 'FilteredTasks', id: 'LIST' },
      ],
    }),

    deleteTask: builder.mutation<void, { taskId: number; projectId: number }>({
      query: ({ taskId }) => ({
        url: '/tasks',
        method: 'DELETE',
        params: { taskId },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: 'Task', id: taskId },
        { type: 'FilteredTasks', id: 'LIST' },
      ],
    }),

    getTaskById: builder.query<TaskResponse, number>({
      query: (taskId) => ({
        url: '/tasks',
        method: 'GET',
        params: { taskId },
      }),
      providesTags: (result, error, taskId) =>
        result?.data ? [{ type: 'Task', id: result.data.id }] : ['Task'],
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useUpdateFragmentTaskMutation,
  useGetTaskByIdQuery,
  useLazyGetFilteredTasksQuery,
  useGetFilteredTasksQuery,
  useLazyGetTaskByIdQuery
} = taskApi;