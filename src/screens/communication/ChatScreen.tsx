import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loading } from '@/components/ui/Loading';
import { useMyChatRooms } from '@/hooks/useChat';
import { useAuthStore } from '@/store/auth.store';

export function ChatScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const roomsQuery = useMyChatRooms();

  if (roomsQuery.isLoading) {
    return <Loading label="Loading conversations..." />;
  }

  if (roomsQuery.isError) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-6">
        <EmptyState title="Unable to load chat" description="Please try again later." />
      </View>
    );
  }

  const rooms = roomsQuery.data ?? [];

  return (
    <ScrollView className="flex-1 bg-slate-50" contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      <Text className="text-2xl font-bold text-slate-900">Messages</Text>

      <View className="mt-4 gap-3">
        {rooms.length === 0 ? (
          <EmptyState title="No conversations yet" description="You have not started chatting with any doctor yet." />
        ) : (
          rooms.map((room) => {
            const peer = room.user1.id === user?.id ? room.user2 : room.user1;
            return (
              <Card key={room.id}>
                <Text className="text-base font-bold text-slate-900">{peer.fullName || 'User'}</Text>
                <Text className="mt-1 text-sm text-slate-500">{peer.email}</Text>
                <Text className="mt-1 text-xs text-slate-400">{new Date(room.updatedAt).toLocaleString()}</Text>

                <View className="mt-3">
                  <Button title="Open conversation" onPress={() => router.push(`/chat/${room.id}`)} />
                </View>
              </Card>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

export default ChatScreen;