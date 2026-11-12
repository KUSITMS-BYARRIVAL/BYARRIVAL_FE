import type { Href } from "expo-router";

import {
  ConsecutiveRewardsIcon,
  InspectionIcon,
  SmallTalkIcon,
  SubwayLineIcon,
} from "@/assets/icons";

// 디자인이 나온 유형만 둔다. 전체 유형 · 이동 화면은 plan_spec §11
export const NOTIFICATION_TYPES = {
  ROUTE_READY: { Icon: SubwayLineIcon, href: "/ride/boarding-pass" },
  STREAK_MILESTONE: { Icon: ConsecutiveRewardsIcon, href: "/my" },
  SMALLTALK: { Icon: SmallTalkIcon, href: "/smalltalk" },
  // 공지사항 페이지가 없어 홈으로 보낸다
  SERVICE_NOTICE: { Icon: InspectionIcon, href: "/" },
} satisfies Record<string, { Icon: typeof SubwayLineIcon; href: Href }>;

export type NotificationType = keyof typeof NOTIFICATION_TYPES;
