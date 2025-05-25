import { BaseApiResponse } from "./global";


export interface ProjectDto {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  name: string;
  description: string;
}

export interface UpdateProjectDto {
  name: string;
  description: string;
}

export type ProjectsResponse = BaseApiResponse<ProjectDto[]>;
export type OneProjectResponse = BaseApiResponse<ProjectDto>;
