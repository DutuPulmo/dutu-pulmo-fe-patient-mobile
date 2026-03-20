import { useMutation } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import type { ChangePasswordDto } from '@/types/auth.types';

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordDto) => userService.changePassword(payload),
  });
}

export default useUpdatePassword;
