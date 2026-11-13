// 컨디션 기록 막대·범례 순서와 색 (Figma 마이홈 - 컨디션 기록)
export const CONDITION_SEGMENTS = [
  { key: "sunny", label: "맑음", colorClassName: "bg-yellow" },
  { key: "default", label: "보통", colorClassName: "bg-green-500" },
  { key: "cloudy", label: "흐림", colorClassName: "bg-grey-300" },
  { key: "rain", label: "비", colorClassName: "bg-grey-500" },
] as const;

export type ConditionCounts = Record<
  (typeof CONDITION_SEGMENTS)[number]["key"],
  number
>;

/** none: 앱 미접속 / visit: 접속만 / partial: 일부 완독 / complete: 전체 완독(노선 완주) */
export type StripLevel = "none" | "visit" | "partial" | "complete";
