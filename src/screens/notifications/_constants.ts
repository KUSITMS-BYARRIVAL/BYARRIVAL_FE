import {
  ConsecutiveRewardsIcon,
  InspectionIcon,
  PopularArticleIcon,
  SmallTalkIcon,
  SubwayLineIcon,
} from "@/assets/icons";
import type { NotificationType } from "@/types/notification/notification.types";

// 누르면 이동할 화면은 _helpers.ts의 openNotification
export const NOTIFICATION_TYPES = {
  ROUTE_READY: { Icon: SubwayLineIcon },
  ROUTE_INCOMPLETE: { Icon: SubwayLineIcon },
  STREAK_MILESTONE: { Icon: ConsecutiveRewardsIcon },
  STREAK_BREAK: { Icon: ConsecutiveRewardsIcon },
  SMALLTALK: { Icon: SmallTalkIcon },
  SERVICE_NOTICE: { Icon: InspectionIcon },
  TEST: { Icon: InspectionIcon },
  POPULAR_ARTICLE: { Icon: PopularArticleIcon },
} satisfies Record<NotificationType, { Icon: typeof SubwayLineIcon }>;
