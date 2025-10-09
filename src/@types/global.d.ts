export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  content: T;
}
