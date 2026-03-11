import { ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loading } from '@/components/ui/Loading';
import {
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useNotifications,
} from '@/hooks/useNotifications';

export function NotificationsScreen() {
  const notificationsQuery = useNotifications({ page: 1, limit: 20 });
  const markOneMutation = useMarkNotificationAsRead();
  const markAllMutation = useMarkAllNotificationsAsRead();

  if (notificationsQuery.isLoading) return <Loading label="Loading notifications..." />;

  if (notificationsQuery.isError) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-6">
        <EmptyState title="Unable to load notifications" description="Please try again later." />
      </View>
    );
  }

  const notifications = notificationsQuery.data?.items ?? [];

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-slate-900">Notifications</Text>
        <Button title="Mark all as read" variant="ghost" loading={markAllMutation.isPending} onPress={() => markAllMutation.mutate()} />
      </View>

      <View className="mt-4 gap-3">
        {notifications.length === 0 ? (
          <EmptyState title="No notifications yet" description="New notifications will appear here." />
        ) : (
          notifications.map((item) => (
            <Card key={item.id}>
              <Text className="text-base font-bold text-slate-900">{item.title}</Text>
              <Text className="mt-1 text-sm text-slate-600">{item.content}</Text>
              <Text className="mt-1 text-xs text-slate-400">{item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}</Text>
              <View className="mt-3">
                <Button
                  title="Mark as read"
                  variant="secondary"
                  loading={markOneMutation.isPending}
                  onPress={() => markOneMutation.mutate(item.id)}
                />
              </View>
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
}

export default NotificationsScreen;