import type { Href } from "expo-router";

import {
  ConsecutiveRewardsIcon,
  InspectionIcon,
  SmallTalkIcon,
  SubwayLineIcon,
} from "@/assets/icons";
import type { NotificationType } from "@/types/notification/notification.types";

// 이동 화면은 docs/screens/notifications.md 「알림 유형과 이동 화면」
export const NOTIFICATION_TYPES = {
  ROUTE_READY: { Icon: SubwayLineIcon, href: "/ride/boarding-pass" },
  // 이어보기는 홈 탑승 버튼이 처리한다
  ROUTE_INCOMPLETE: { Icon: SubwayLineIcon, href: "/" },
  STREAK_MILESTONE: { Icon: ConsecutiveRewardsIcon, href: "/my" },
  STREAK_BREAK: { Icon: ConsecutiveRewardsIcon, href: "/" },
  SMALLTALK: { Icon: SmallTalkIcon, href: "/smalltalk" },
  // 공지사항 페이지가 없어 홈으로 보낸다
  SERVICE_NOTICE: { Icon: InspectionIcon, href: "/" },
  TEST: { Icon: InspectionIcon, href: "/" },
  // shortcut: 아이콘 디자인 전이라 점검 아이콘 · 홈 이동, 디자인이 나오면 아이콘과 기사 상세로 교체
  POPULAR_ARTICLE: { Icon: InspectionIcon, href: "/" },
} satisfies Record<
  NotificationType,
  { Icon: typeof SubwayLineIcon; href: Href }
>;
