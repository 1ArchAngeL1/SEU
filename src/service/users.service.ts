import { apiGet, apiPost, apiDelete } from '@/lib/api-client';

export interface AdminUser {
  id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  username: string;
  password: string;
}

export const usersService = {
  getAll(): Promise<AdminUser[]> {
    return apiGet<AdminUser[]>('/users');
  },

  create(input: CreateUserInput): Promise<{ access_token: string }> {
    return apiPost<{ access_token: string }, CreateUserInput>(
      '/auth/register',
      input,
    );
  },

  remove(id: string): Promise<{ deleted: boolean; id: string }> {
    return apiDelete(`/users/${id}`);
  },
};
