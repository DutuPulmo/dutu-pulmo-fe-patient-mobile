import { api } from '@/services/api';
import { cleanParams } from '@/utils/query';
import type {
  NotificationActionResponse,
  NotificationItem,
  NotificationListResponse,
  NotificationQuery,
  NotificationUnreadCountResponse,
} from '@/types/notification.types';

export type { NotificationQuery };

const DEFAULT_META: NotificationListResponse['meta'] = {
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

const NOTIFICATION_TYPES = new Set<NotificationItem['type']>([
  'GENERAL',
  'PAYMENT',
  'SYSTEM',
  'APPOINTMENT',
]);

const NOTIFICATION_STATUSES = new Set<NotificationItem['status']>([
  'ACTIVE',
  'INACTIVE',
  'PENDING',
  'APPROVED',
  'REJECTED',
  'COMPLETED',
  'CANCELLED',
]);

const normalizeNotificationItem = (
  raw: Partial<NotificationItem> | null | undefined,
): NotificationItem | null => {
  if (!raw || typeof raw.id !== 'string' || raw.id.length === 0) {
    return null;
  }

  return {
    id: raw.id,
    userId: typeof raw.userId === 'string' ? raw.userId : '',
    type: NOTIFICATION_TYPES.has(raw.type ?? 'SYSTEM') ? raw.type! : 'SYSTEM',
    title: typeof raw.title === 'string' ? raw.title : '',
    content: typeof raw.content === 'string' ? raw.content : '',
    status: NOTIFICATION_STATUSES.has(raw.status ?? 'PENDING')
      ? raw.status!
      : 'PENDING',
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : undefined,
  };
};

const normalizeNotificationList = (
  payload: NotificationListResponse | undefined,
  query?: NotificationQuery,
): NotificationListResponse => ({
  items: Array.isArray(payload?.items)
    ? payload.items
        .map((item) => normalizeNotificationItem(item))
        .filter((item): item is NotificationItem => item !== null)
    : ([] as NotificationItem[]),
  meta: payload?.meta ?? {
    ...DEFAULT_META,
    currentPage: query?.page ?? DEFAULT_META.currentPage,
    itemsPerPage: query?.limit ?? DEFAULT_META.itemsPerPage,
  },
});

export const notificationService = {
  getNotifications: async (query?: NotificationQuery) => {
    const { data } = await api.get<NotificationListResponse>('/notifications', {
      params: cleanParams(query),
    });
    return normalizeNotificationList(data, query);
  },

  getUnreadCount: async () => {
    const { data } = await api.get<NotificationUnreadCountResponse>(
      '/notifications/unread-count',
    );
    return { count: Number(data?.count ?? 0) };
  },

  markAllAsRead: async () => {
    const { data } = await api.patch<NotificationActionResponse>(
      '/notifications/read-all',
    );
    return {
      success: Boolean(data?.success),
      message: data?.message ?? '',
    };
  },

  markAsRead: async (notificationId: string) => {
    const { data } = await api.patch<NotificationActionResponse>(
      `/notifications/${notificationId}/read`,
    );
    return {
      success: Boolean(data?.success),
      message: data?.message ?? '',
    };
  },
};

export default notificationService;
