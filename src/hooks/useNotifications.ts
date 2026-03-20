import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { notificationService, type NotificationQuery } from '@/services/notification.service';

const notificationKeys = {
  list: (params?: NotificationQuery) => ['notifications', params] as const,
  unreadCount: ['notifications', 'unread-count'] as const,
};

export function useNotifications(params?: NotificationQuery) {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => notificationService.getNotifications(params),
  });
}

export function useNotificationUnreadCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount,
    queryFn: () => notificationService.getUnreadCount(),
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => notificationService.markAsRead(notificationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useTestPushNotification() {
  return useMutation({
    mutationFn: ({ title, content }: { title: string; content: string }) =>
      notificationService.testPushNotification(title, content),
  });
}
