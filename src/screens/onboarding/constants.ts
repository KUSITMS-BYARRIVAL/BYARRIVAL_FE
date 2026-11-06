import type { ComponentType } from "react";
import type { SvgProps } from "react-native-svg";

import {
  CategoryCareerIcon,
  CategoryCareerSelectedIcon,
  CategoryCultureIcon,
  CategoryCultureSelectedIcon,
  CategoryEconomyIcon,
  CategoryEconomySelectedIcon,
  CategoryGlobalIcon,
  CategoryGlobalSelectedIcon,
  CategoryLifeIcon,
  CategoryLifeSelectedIcon,
  CategoryScienceIcon,
  CategoryScienceSelectedIcon,
  CategorySocietyIcon,
  CategorySocietySelectedIcon,
  CategoryTechIcon,
  CategoryTechSelectedIcon,
} from "@/assets/icons";
import {
  AssetBagIllustration,
  AssetSubwayIllustration,
  AssetSuitIllustration,
} from "@/assets/illustrations";
import type { Interest, UserType } from "@/stores/onboarding-store";

// 이 도메인의 여러 화면이 함께 쓰는 값만 둔다. 한 화면에서만 쓰는 문구는 그 화면 파일에 둔다

// 온보딩 단계 수 (닉네임·유형·출근 시각·이동 시간·관심 분야·직군·근무지). Figma Progress Stepper 7단계
export const ONBOARDING_STEPS = 7;

// 닉네임을 입력하기 전 보여줄 기본 닉네임 (화면설계서 ONB-04)
export const DEFAULT_NICKNAME = "출근러";

// 이동 유형 선택지 (화면설계서 ONB-05). 유형 선택·온보딩 완료 요약에서 함께 쓴다
export const USER_TYPES: {
  type: UserType;
  title: string;
  description: string;
  Asset: ComponentType<SvgProps>;
}[] = [
  {
    type: "worker",
    title: "직장인",
    description: "출근길에 읽어요",
    Asset: AssetSuitIllustration,
  },
  {
    type: "student",
    title: "학생",
    description: "등교·통학길에 읽어요",
    Asset: AssetBagIllustration,
  },
  {
    type: "other",
    title: "기타",
    description: "이동하는 시간에 읽어요",
    Asset: AssetSubwayIllustration,
  },
];

// 관심 분야 선택지 (화면설계서 ONB-08). 관심 분야 선택·온보딩 완료 요약에서 함께 쓴다
export const INTERESTS: {
  value: Interest;
  title: string;
  subtitle: string;
  Icon: ComponentType<SvgProps>;
  SelectedIcon: ComponentType<SvgProps>;
}[] = [
  {
    value: "economy",
    title: "경제",
    subtitle: "Economy",
    Icon: CategoryEconomyIcon,
    SelectedIcon: CategoryEconomySelectedIcon,
  },
  {
    value: "tech",
    title: "테크",
    subtitle: "Tech",
    Icon: CategoryTechIcon,
    SelectedIcon: CategoryTechSelectedIcon,
  },
  {
    value: "career",
    title: "커리어",
    subtitle: "Career",
    Icon: CategoryCareerIcon,
    SelectedIcon: CategoryCareerSelectedIcon,
  },
  {
    value: "society",
    title: "사회",
    subtitle: "Society",
    Icon: CategorySocietyIcon,
    SelectedIcon: CategorySocietySelectedIcon,
  },
  {
    value: "global",
    title: "글로벌",
    subtitle: "Global",
    Icon: CategoryGlobalIcon,
    SelectedIcon: CategoryGlobalSelectedIcon,
  },
  {
    value: "life",
    title: "라이프",
    subtitle: "Lifestyle",
    Icon: CategoryLifeIcon,
    SelectedIcon: CategoryLifeSelectedIcon,
  },
  {
    value: "science",
    title: "과학",
    subtitle: "Science",
    Icon: CategoryScienceIcon,
    SelectedIcon: CategoryScienceSelectedIcon,
  },
  {
    value: "culture",
    title: "문화",
    subtitle: "Culture",
    Icon: CategoryCultureIcon,
    SelectedIcon: CategoryCultureSelectedIcon,
  },
];
