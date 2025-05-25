export interface BaseApiResponse<T = null> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  status: number;
  data: {
    data: null;
    message: string;
    statusCode: number;
    success: false;
  };
}