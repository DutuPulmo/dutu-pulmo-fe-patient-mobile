import { useMutation } from '@tanstack/react-query';

import { registerFcmTokenAfterLogin } from '@/services/fcm.service';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import type { LoginDto } from '@/types/auth.types';

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (payload: LoginDto) => authService.login(payload),
    onSuccess: (data) => {
      setSession({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.account.user,
      });

      setTimeout(() => {
        void registerFcmTokenAfterLogin().catch((error) => {
          console.warn('FCM registration failed:', error);
        });
      }, 1000);
    },
    onError: (error: any) => {
      if (!__DEV__) {
        return;
      }

      console.log('Request URL:', error?.config?.url);
      console.log('Base URL:', error?.config?.baseURL);
      console.log('Message:', error?.message);
      console.log('Code:', error?.code);
    },
  });
}
