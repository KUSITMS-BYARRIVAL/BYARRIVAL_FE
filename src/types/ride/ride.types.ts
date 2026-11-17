// Swagger 스키마 그대로 (도메인 코드 ride: Route 태그)

export type RouteStatus =
  "CREATED" | "BOARDING" | "IN_PROGRESS" | "COMPLETED" | "EXPIRED";

export type TodayRouteState = "NONE" | "EMPTY" | RouteStatus;

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
  condition: "SUNNY" | "NORMAL" | "CLOUDY" | "RAINY";
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
