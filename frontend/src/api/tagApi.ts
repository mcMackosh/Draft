import { createApi } from '@reduxjs/toolkit/query/react';
import { TagsResponse, TagResponse, CreateTagDto, UpdateTagDto } from '../type/tag';
import baseQueryWithReauth from './config/basequeary';

export const tagApi = createApi({
  reducerPath: 'tagApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Tag'],
  endpoints: (builder) => ({
    createTag: builder.mutation<TagResponse, CreateTagDto>({
      query: (tagDto) => ({
        url: 'tags',
        method: 'POST',
        body: tagDto,
      }),
      invalidatesTags: ['Tag'],
    }),
    getTags: builder.query<TagsResponse, number>({
      query: () => 'tags/all',
      providesTags: ['Tag'],
    }),
    updateTag: builder.mutation<TagResponse, { tagId: number; tagDto: UpdateTagDto }>({
      query: ({ tagId, tagDto }) => ({
        url: `tags?tagId=${tagId}`,
        method: 'PUT',
        body: tagDto,
      }),
      invalidatesTags: ['Tag'],
    }),
    deleteTag: builder.mutation<TagsResponse, number>({
      query: (tagId) => ({
        url: `tags?tagId=${tagId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tag'],
    }),
  }),
});

export const {
  useCreateTagMutation,
  useGetTagsQuery,
  useUpdateTagMutation,
  useDeleteTagMutation,
} = tagApi;