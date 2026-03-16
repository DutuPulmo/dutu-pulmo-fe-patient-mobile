import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { chatService } from '@/services/chat.service';

const chatKeys = {
  myRooms: ['chat', 'rooms'] as const,
  room: (chatroomId: string) => ['chat', 'room', chatroomId] as const,
  messages: (chatroomId: string) => ['chat', 'messages', chatroomId] as const,
};

export function useMyChatRooms() {
  return useQuery({
    queryKey: chatKeys.myRooms,
    queryFn: () => chatService.getMyChats(),
  });
}

export function useChatRoom(chatroomId: string) {
  return useQuery({
    queryKey: chatKeys.room(chatroomId),
    queryFn: () => chatService.getChatRoomDetail(chatroomId),
    enabled: Boolean(chatroomId),
  });
}

export function useChatMessages(chatroomId: string) {
  return useQuery({
    queryKey: chatKeys.messages(chatroomId),
    queryFn: () => chatService.getChatMessages(chatroomId),
    enabled: Boolean(chatroomId),
  });
}

export function useSendChatMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      chatroomId,
      content,
    }: {
      chatroomId: string;
      content: string;
    }) => chatService.sendMessage({ chatroomId, content }),
    onSuccess: (message) => {
      void queryClient.invalidateQueries({
        queryKey: chatKeys.messages(message.chatroomId),
      });
      void queryClient.invalidateQueries({ queryKey: chatKeys.myRooms });
    },
  });
}
