export * from '@/types/generated/patient-api';

export type ResponseCommon<T> = {
  code: number;
  message: string;
  data?: T;
};

export interface ChangePasswordDto {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

