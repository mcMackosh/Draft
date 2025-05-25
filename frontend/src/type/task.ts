// export interface Task {
//   id: number;
//   name: string;
//   priority: string;
//   tagId: number;
//   status: string;
//   executorId: number;
//   endExecutionAt: string;
// }

import { BaseApiResponse } from "./global";

// export interface TasksByDate {
//   date: string;
//   tasks: Task[];
// }

// export interface UserWithTasks {
//   id?: number;
//   tasksByDate: TasksByDate[];
// }

// export interface TaskFilterRequest {
//   TagIds?: number[];
//   ExecutorIds?: number[];
//   DeadlineDateStart?: string;
//   DeadlineDateEnd?: string;
//   SortByDeadline?: string;
//   SearchQuery?: string;
//   Priorities?: string[];
//   Statuses?: string[];
// }

// export interface GetTasksParams {
//   projectId: number;
//   filters: TaskFilterRequest;
// }

// export interface TaskDto {
//   id: number;
//   name: string;
//   description: string;
//   priority: string;
//   tagId?: number;
//   projectId?: number;
//   status?: string;
//   executorId?: number;
//   startExecutionAt?: string;
//   endExecutionAt?: string;
// }

// export interface TaskCreateDto {
//   name: string;
//   description?: string;
//   priority: string;
//   tagId?: number;
//   status?: string;
//   executorId?: number;
//   startExecutionAt?: string;
//   endExecutionAt?: string;
//   projectId?: number;
// }

// export interface TaskUpdateDto {
//   id: number;
//   name: string;
//   description?: string;
//   priority: string;  
//   tagId?: number;
//   status: string;
//   executorId?: number;
//   startExecutionAt?: string;
//   endExecutionAt?: string;
// }


export interface Task {
  id: number;
  name: string;
  priority: string;
  tagId: number;
  status: string;
  executorId: number;
  endExecutionAt: string;
}

export interface TasksByDate {
  date: string;
  tasks: Task[];
}

export interface UserWithTasks {
  id?: number;
  tasksByDate: TasksByDate[];
}

export interface TaskFilterRequest {
  TagIds?: number[];
  ExecutorIds?: number[];
  DeadlineDateStart?: string;
  DeadlineDateEnd?: string;
  SortByDeadline?: string;
  SearchQuery?: string;
  Priorities?: string[];
  Statuses?: string[];
}

export interface GetTasksParams {
  projectId: number;
  filters: TaskFilterRequest;
}

export interface TaskDto {
  id: number;
  name: string;
  description: string;
  priority: string;
  tagId?: number;
  projectId?: number;
  status?: string;
  executorId?: number;
  startExecutionAt?: string;
  endExecutionAt?: string;
}

export interface TaskCreateDto {
  name: string;
  description?: string;
  priority: string;
  tagId?: number;
  status?: string;
  executorId?: number;
  startExecutionAt?: string;
  endExecutionAt?: string;
  projectId?: number;
}

export interface TaskUpdateDto {
  id: number;
  name: string;
  description?: string;
  priority: string;
  tagId?: number;
  status: string;
  executorId?: number;
  startExecutionAt?: string;
  endExecutionAt?: string;
}

// Приклади типів для відповідей API:
export type TaskResponse = BaseApiResponse<TaskDto>;
export type TasksByDateResponse = BaseApiResponse<TasksByDate[]>;
export type UserWithTasksResponse = BaseApiResponse<UserWithTasks[]>;
export type TaskListResponse = BaseApiResponse<TaskDto[]>;
export type TaskDtoResponse = BaseApiResponse<TaskDto>;