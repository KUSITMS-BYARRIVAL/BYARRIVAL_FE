import type { Weekday } from "@/stores/profile-store";

// 요일별 설정 화면(이동 시간·출근 시간)에서 함께 쓰는 요일 순서와 라벨
export const WEEKDAYS: { value: Weekday; label: string }[] = [
  { value: "mon", label: "월" },
  { value: "tue", label: "화" },
  { value: "wed", label: "수" },
  { value: "thu", label: "목" },
  { value: "fri", label: "금" },
  { value: "sat", label: "토" },
  { value: "sun", label: "일" },
];
