import type { ComponentType } from "react";
import type { SvgProps } from "react-native-svg";

import {
  CategoryCounselIcon,
  CategoryCounselSelectedIcon,
  CategoryDeliveryIcon,
  CategoryDeliverySelectedIcon,
  CategoryDesignIcon,
  CategoryDesignSelectedIcon,
  CategoryEconomyIcon,
  CategoryEconomySelectedIcon,
  CategoryEtcIcon,
  CategoryEtcSelectedIcon,
  CategoryFinanceIcon,
  CategoryFinanceSelectedIcon,
  CategoryGlobalIcon,
  CategoryGlobalSelectedIcon,
  CategoryHealthIcon,
  CategoryHealthSelectedIcon,
  CategoryHumanResourcesIcon,
  CategoryHumanResourcesSelectedIcon,
  CategoryLaptopIcon,
  CategoryLaptopSelectedIcon,
  CategoryLifeIcon,
  CategoryLifeSelectedIcon,
  CategoryMarketingIcon,
  CategoryMarketingSelectedIcon,
  CategoryMediaIcon,
  CategoryMediaSelectedIcon,
  CategoryMedicalIcon,
  CategoryMedicalSelectedIcon,
  CategoryPublicIcon,
  CategoryPublicSelectedIcon,
  CategoryResearchIcon,
  CategoryResearchSelectedIcon,
  CategoryScienceIcon,
  CategoryScienceSelectedIcon,
  CategorySocietyIcon,
  CategorySocietySelectedIcon,
  CategorySportsIcon,
  CategorySportsSelectedIcon,
  CategoryTechIcon,
  CategoryTechSelectedIcon,
} from "@/assets/icons";
import {
  AssetBagIllustration,
  AssetSubwayIllustration,
  AssetSuitIllustration,
} from "@/assets/illustrations";
import type {
  Interest,
  JobGroup,
  Region,
  UserType,
} from "@/stores/onboarding-store";

// 사용자 유형별로 '출근' · '출근길' · '직장인' 문구를 바꾼다
export const COMMUTE_WORDS: Record<
  UserType,
  { commute: string; route: string; person: string }
> = {
  worker: { commute: "출근", route: "출근길", person: "직장인" },
  student: { commute: "등교", route: "등굣길", person: "학생" },
  other: { commute: "이동", route: "이동길", person: "유저" },
};

// 이동 유형 선택지 (화면설계서 ONB-05). 온보딩 유형 선택·완료 요약, 마이 이동 상황 설정에서 함께 쓴다
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

// 관심 분야 선택지 (Figma SelectionButton_Category 순서·이름·아이콘). 온보딩 관심 분야 선택·완료 요약, 마이 관심 카테고리 설정에서 함께 쓴다
export const INTERESTS: {
  value: Interest;
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

// 직군 선택지 (화면설계서 ONB-09, 12개 분류). 온보딩 직군 선택·마이 직군 설정에서 함께 쓴다
export const JOB_GROUPS: {
  value: JobGroup;
  title: string;
  example: string;
  Icon: ComponentType<SvgProps>;
  SelectedIcon: ComponentType<SvgProps>;
}[] = [
  {
    value: "planning_marketing",
    title: "기획·마케팅",
    example: "기획·전략·마케팅",
    Icon: CategoryMarketingIcon,
    SelectedIcon: CategoryMarketingSelectedIcon,
  },
  {
    value: "hr_legal",
    title: "인사·총무·법무",
    example: "인사·노무·총무·법무",
    Icon: CategoryHumanResourcesIcon,
    SelectedIcon: CategoryHumanResourcesSelectedIcon,
  },
  {
    value: "finance_accounting",
    title: "금융·회계",
    example: "금융·보험·회계·세무",
    Icon: CategoryFinanceIcon,
    SelectedIcon: CategoryFinanceSelectedIcon,
  },
  {
    value: "it_data",
    title: "IT개발·데이터",
    example: "개발·데이터·QA",
    Icon: CategoryLaptopIcon,
    SelectedIcon: CategoryLaptopSelectedIcon,
  },
  {
    value: "design",
    title: "디자인",
    example: "UI·그래픽·영상",
    Icon: CategoryDesignIcon,
    SelectedIcon: CategoryDesignSelectedIcon,
  },
  {
    value: "sales_service",
    title: "영업·서비스·상담",
    example: "영업·MD·CS·매장",
    Icon: CategoryCounselIcon,
    SelectedIcon: CategoryCounselSelectedIcon,
  },
  {
    value: "manufacturing_logistics",
    title: "제조·물류·건설",
    example: "생산·물류·운송·건설",
    Icon: CategoryDeliveryIcon,
    SelectedIcon: CategoryDeliverySelectedIcon,
  },
  {
    value: "medical",
    title: "의료",
    example: "의사·간호·약사",
    Icon: CategoryMedicalIcon,
    SelectedIcon: CategoryMedicalSelectedIcon,
  },
  {
    value: "research_education",
    title: "연구·교육",
    example: "R&D·연구·교육",
    Icon: CategoryResearchIcon,
    SelectedIcon: CategoryResearchSelectedIcon,
  },
  {
    value: "media_culture",
    title: "미디어·문화·스포츠",
    example: "방송·콘텐츠·스포츠",
    Icon: CategoryMediaIcon,
    SelectedIcon: CategoryMediaSelectedIcon,
  },
  {
    value: "public_welfare",
    title: "공공·복지",
    example: "공무원·공기업·복지",
    Icon: CategoryPublicIcon,
    SelectedIcon: CategoryPublicSelectedIcon,
  },
  {
    value: "etc",
    title: "기타·프리랜서",
    example: "자영업·프리랜서·취준",
    Icon: CategoryEtcIcon,
    SelectedIcon: CategoryEtcSelectedIcon,
  },
];

// 화면설계서 MY-04: "○○전체"는 시/도명만 보여준다
export const regionLabel = ({ province, district }: Region) =>
  district ? `${province} ${district}` : province;
