import type { components, operations } from '@/types/generated/patient-api';

export type NotificationItem = components['schemas']['NotificationResponseDto'];
export type NotificationActionResponse =
  components['schemas']['NotificationActionResponseDto'];
export type NotificationUnreadCountResponse =
  components['schemas']['NotificationUnreadCountResponseDto'];
export type NotificationListResponse = {
  items: NotificationItem[];
  meta: components['schemas']['PaginationMetaDto'];
};

export type NotificationQuery =
  operations['NotificationController_getUserNotifications']['parameters']['query'];
