export * from '@/types/generated/patient-api';

export type ResponseCommon<T> = {
  code: number;
  message: string;
  data?: T;
};
