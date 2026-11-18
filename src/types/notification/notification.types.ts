export type DevicePlatform = "IOS" | "ANDROID";

export type DeviceRegisterRequest = {
  fcmToken: string;
  platform: DevicePlatform;
};

export type NotificationType =
  | "ROUTE_READY"
  | "ROUTE_INCOMPLETE"
  | "STREAK_MILESTONE"
  | "SMALLTALK"
  | "STREAK_BREAK"
  | "POPULAR_ARTICLE"
  | "SERVICE_NOTICE"
  | "TEST";

export type NotificationItem = {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  params: Record<string, string>;
  read: boolean;
  createdAt: string;
};

export type NotificationPageParams = {
  cursor?: number;
  size?: number;
};

export type NotificationPage = {
  notifications: NotificationItem[];
  nextCursor: number;
  hasNext: boolean;
};

export type UnreadCount = { count: number };
