import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService, type AdminUser, type CreateUserInput } from '@/service/users.service';

const usersKeys = {
  all: ['users'] as const,
};

export function useUsersList() {
  return useQuery<AdminUser[]>({
    queryKey: usersKeys.all,
    queryFn: () => usersService.getAll(),
    staleTime: 30_000,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateUserInput) => usersService.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: usersKeys.all }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: usersKeys.all }),
  });
}
