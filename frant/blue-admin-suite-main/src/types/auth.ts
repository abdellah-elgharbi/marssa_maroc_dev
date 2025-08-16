export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface TokenRefreshRequest {
  refreshToken: string;
}

export interface User {
  user_id: number;
  username: string;
  password: string;
  role: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  role: string;
}

export interface UpdateUserRequest {
  username?: string;
  password?: string;
  role?: string;
}