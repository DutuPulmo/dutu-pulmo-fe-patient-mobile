import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import { useChatMessages, useChatRoom, useSendChatMessage } from '@/hooks/useChat';
import { useAuthStore } from '@/store/auth.store';

export function ChatRoomScreen() {
  const { chatroomId } = useLocalSearchParams<{ chatroomId: string }>();
  const user = useAuthStore((state) => state.user);

  const roomQuery = useChatRoom(chatroomId);
  const messagesQuery = useChatMessages(chatroomId);
  const sendMutation = useSendChatMessage();

  const [content, setContent] = useState('');

  if (roomQuery.isLoading || messagesQuery.isLoading) {
    return <Loading label="Loading conversation..." />;
  }

  if (roomQuery.isError || messagesQuery.isError || !roomQuery.data) {
    return (
      <View className="flex-1 items-center justify-center bg-background-light px-6">
        <EmptyState title="Unable to load conversation" description="Please try again later." />
      </View>
    );
  }

  const room = roomQuery.data;
  const peer = room.user1.id === user?.id ? room.user2 : room.user1;
  const messages = messagesQuery.data ?? [];

  const onSend = () => {
    if (!content.trim()) return;

    sendMutation.mutate(
      { chatroomId, content: content.trim() },
      {
        onSuccess: () => setContent(''),
      },
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background-light"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <View className="border-b border-slate-200 bg-white px-4 py-3">
        <Text className="text-lg font-bold text-slate-900">{peer.fullName || 'Conversation'}</Text>
        <Text className="text-xs text-slate-500">{peer.email}</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-3">
        {messages.length === 0 ? (
          <EmptyState title="No messages yet" description="Send the first message." />
        ) : (
          <View className="gap-2">
            {messages.map((message) => {
              const isMine = message.sender.id === user?.id;
              return (
                <Card key={message.id} className={isMine ? 'self-end bg-blue-600' : 'self-start bg-white'}>
                  <Text className={`text-sm ${isMine ? 'text-white' : 'text-slate-900'}`}>{message.content}</Text>
                  <Text className={`mt-1 text-xs ${isMine ? 'text-blue-100' : 'text-slate-400'}`}>
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </Text>
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>

      <View className="border-t border-slate-200 bg-white px-4 py-3">
        <Input value={content} onChangeText={setContent} placeholder="Type a message..." />
        <View className="mt-2">
          <Button title="Send" loading={sendMutation.isPending} onPress={onSend} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default ChatRoomScreen;
