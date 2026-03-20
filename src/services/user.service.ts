import { api } from '@/services/api';
import type { components } from '@/types/generated/patient-api';
import type { ChangePasswordDto, ResponseCommon } from '@/types/auth.types';

type UpdateUserDto = components['schemas']['UpdateUserDto'];
type UserResponseDto = components['schemas']['UserResponseDto'];

export const userService = {
  updateUser: async (userId: string, payload: UpdateUserDto) => {
    const { data } = await api.patch<UserResponseDto>(`/users/${userId}`, payload);
    return data;
  },

  changePassword: async (payload: ChangePasswordDto) => {
    const { data } = await api.patch<ResponseCommon<void>>(
      '/users/me/change-password',
      payload,
    );
    return data;
  },
};

export default userService;

