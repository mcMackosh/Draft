import { BaseApiResponse } from "./global";

export interface Tag {
  id: number;
  name: string;
  color: string;
}

export interface CreateTagDto {
  name: string;
  color: string;
}

export interface UpdateTagDto {
  name: string;
  color: string;
}

export type TagsResponse = BaseApiResponse<Tag[]>;
export type TagResponse = BaseApiResponse<Tag>;