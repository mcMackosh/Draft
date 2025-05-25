import { BaseApiResponse } from "./global";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyRequest {
  email: string;
  code: string;
}

export interface RegisterRequest {
  login: string;
  email: string;
  password: string;
}

export interface LoginResponseData {
  access_token: string;
  refresh_token: string;
  user: UserDTO;
}


export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EXECUTOR = 'EXECUTOR',
  VIEWER = 'VIEWER'
}

export interface UserDTO {
  id: number;
  login: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  currentProjectId: number | null;
  role: UserRole;
}

export interface Role {
  userId: number;
  userLogin: string;
  userEmail: string;
  role: UserRole;
}

export interface AssignRoleRequest {
  userId: number;
  role: UserRole;
}

export interface RemoveRoleRequest {
  userId: number;
  projectId: number;
}

export type RoleResponse = BaseApiResponse<Role[]>;

export type UserResponse = BaseApiResponse<UserDTO>;

export type OnlyUserDataResponse = BaseApiResponse<UserDTO>;

export type LoginResponse = BaseApiResponse<LoginResponseData>;