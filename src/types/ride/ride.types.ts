// Swagger 스키마 그대로 (도메인 코드 ride: Route · Home 태그)

import type { Smalltalk } from "@/types/smalltalk/smalltalk.types";

export type RouteStatus =
  "CREATED" | "BOARDING" | "IN_PROGRESS" | "COMPLETED" | "EXPIRED";

export type TodayRouteState = "NONE" | "EMPTY" | RouteStatus;

export type Condition = "SUNNY" | "NORMAL" | "CLOUDY" | "RAINY";

export type RouteCart = {
  count: number;
  totalMinutes: number;
  minMinutes: number;
  maxMinutes: number;
  startable: boolean;
  noMoreCards: boolean;
  /** 담은 순서 */
  articleIds: number[];
};

export type RouteCard = {
  cardOrder: number;
  articleId: number;
  title: string;
  categoryId: number;
  categoryName: string;
  pressName: string;
  difficulty: "HARD" | "EASY";
  readingMinutes: number;
  oneLine: string;
  recommended: boolean;
  carted: boolean;
  cartOrder: number | null;
  addable: boolean;
  read: boolean;
};

export type RideProgress = {
  totalStops: number;
  readCount: number;
  currentStop: number;
  remainingStops: number;
  remainingMinutes: number;
  arrivable: boolean;
};

export type Route = {
  routeId: number;
  status: RouteStatus;
  condition: Condition;
  serviceDate: string;
  /** 서비스일 다음 날 04:00 */
  expiresAt: string;
  targetMinutes: number;
  fallbackStep: number;
  lastViewedCardOrder: number | null;
  cart: RouteCart;
  cards: RouteCard[];
  /** 운행 중이거나 완주한 노선만 있다 */
  ride: RideProgress | null;
};

export type TodayRoute = {
  state: TodayRouteState;
  /** NONE · EMPTY면 null */
  route: Route | null;
};

export type PopularArticle = {
  /** 1부터 */
  rank: number;
  articleId: number;
  title: string;
  pressName: string;
  categoryId: number;
  categoryName: string;
  readingMinutes: number;
  /** 그날 이 기사를 노선에 담은 사용자 수 */
  cartedUserCount: number;
  url: string;
};

export type PopularChip = {
  /** 직군 칩이면 직군 코드, 전체 칩이면 null */
  jobGroup: string | null;
  /** AGGREGATING: 칩 범위에서 담은 사용자가 30명 미만이라 순위 미노출 */
  status: "RANKED" | "AGGREGATING";
  articles: PopularArticle[];
};

/** 영역마다 따로 조회해 실패한 영역만 null이다 */
export type Home = {
  serviceDate: string;
  todayRoute: TodayRoute | null;
  streakDays: number | null;
  /** 최대 3개. 비어 있으면 영역 미노출 */
  smalltalks: Smalltalk[] | null;
  /** 오늘 한 번이라도 앱을 쓴 회원 수 */
  todayVisitorCount: number | null;
  /** 고른 직군 칩(고른 순서) 다음에 전체 칩. 칩마다 TOP3 */
  popular: PopularChip[] | null;
};
