import { api } from './api';
import { User, CreateUserRequest, UpdateUserRequest } from '@/types/auth';

export class UserService {
  static async getAllUsers(): Promise<User[]> {
    const response = await api.get<User[]>('/user/all');
    return response.data;
  }

  static async getUserById(id: number): Promise<User> {
    const response = await api.get<User>(`/user/${id}`);
    return response.data;
  }

  static async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await api.post<User>('/user/create', userData);
    return response.data;
  }

  static async updateUser(id: number, userData: UpdateUserRequest): Promise<User> {
    const response = await api.put<User>(`/user/${id}`, userData);
    return response.data;
  }

  static async deleteUser(id: number): Promise<void> {
    await api.delete(`/user/${id}`);
  }
}