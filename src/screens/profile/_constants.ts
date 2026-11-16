import type { ComponentType } from "react";
import type { SvgProps } from "react-native-svg";

import {
  CategoryEconomyIcon,
  CategoryEconomySelectedIcon,
  CategoryGlobalIcon,
  CategoryGlobalSelectedIcon,
  CategoryHealthIcon,
  CategoryHealthSelectedIcon,
  CategoryLifeIcon,
  CategoryLifeSelectedIcon,
  CategoryScienceIcon,
  CategoryScienceSelectedIcon,
  CategorySocietyIcon,
  CategorySocietySelectedIcon,
  CategorySportsIcon,
  CategorySportsSelectedIcon,
  CategoryTechIcon,
  CategoryTechSelectedIcon,
} from "@/assets/icons";
import type { ProfileInterest, Weekday } from "@/stores/profile-store";

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

// 마이 관심 카테고리 선택지 (Figma 마이 - 설정 관심 카테고리 순서·이름·아이콘)
// 온보딩 관심 분야(INTERESTS)와 구성이 달라 이 화면에서만 쓴다
export const PROFILE_INTERESTS: {
  value: ProfileInterest;
  title: string;
  Icon: ComponentType<SvgProps>;
  SelectedIcon: ComponentType<SvgProps>;
}[] = [
  {
    value: "economy",
    title: "경제·금융",
    Icon: CategoryEconomyIcon,
    SelectedIcon: CategoryEconomySelectedIcon,
  },
  {
    value: "health",
    title: "건강·생활",
    Icon: CategoryHealthIcon,
    SelectedIcon: CategoryHealthSelectedIcon,
  },
  {
    value: "entertainment",
    title: "연예·문화",
    Icon: CategoryLifeIcon,
    SelectedIcon: CategoryLifeSelectedIcon,
  },
  {
    value: "politics",
    title: "정치·사회",
    Icon: CategorySocietyIcon,
    SelectedIcon: CategorySocietySelectedIcon,
  },
  {
    value: "science",
    title: "과학·환경",
    Icon: CategoryScienceIcon,
    SelectedIcon: CategoryScienceSelectedIcon,
  },
  {
    value: "tech",
    title: "IT·기술",
    Icon: CategoryTechIcon,
    SelectedIcon: CategoryTechSelectedIcon,
  },
  {
    value: "global",
    title: "세계·국제",
    Icon: CategoryGlobalIcon,
    SelectedIcon: CategoryGlobalSelectedIcon,
  },
  {
    value: "sports",
    title: "스포츠",
    Icon: CategorySportsIcon,
    SelectedIcon: CategorySportsSelectedIcon,
  },
];
