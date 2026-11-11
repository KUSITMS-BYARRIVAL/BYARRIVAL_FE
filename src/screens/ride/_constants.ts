import type { ComponentType } from "react";
import type { SvgProps } from "react-native-svg";

import {
  WeatherCloudyIcon,
  WeatherDefaultIcon,
  WeatherRainIcon,
  WeatherSunnyIcon,
} from "@/assets/icons";
import {
  ConditionFaceCloudyIllustration,
  ConditionFaceDefaultIllustration,
  ConditionFaceRainIllustration,
  ConditionFaceSunnyIllustration,
} from "@/assets/illustrations";

// 컨디션 선택지. Figma 탑승 준비 - 컨디션 카드 순서(위→아래)
export const CONDITIONS: {
  weather: string;
  name: string;
  description: string;
  Face: ComponentType<SvgProps>;
  WeatherIcon: ComponentType<SvgProps>;
}[] = [
  {
    weather: "맑음",
    name: "가뿐해요",
    description: "에너지 충만! 깊이 있는 기사도 거뜬해요!",
    Face: ConditionFaceSunnyIllustration,
    WeatherIcon: WeatherSunnyIcon,
  },
  {
    weather: "보통",
    name: "그저 그래요",
    description: "무난한 하루. 적당한 분량으로 채워요.",
    Face: ConditionFaceDefaultIllustration,
    WeatherIcon: WeatherDefaultIcon,
  },
  {
    weather: "흐림",
    name: "조금 지쳐요",
    description: "가볍고 짧은 기사 위주로 부담없이 읽어요.",
    Face: ConditionFaceCloudyIllustration,
    WeatherIcon: WeatherCloudyIcon,
  },
  {
    // Figma 라벨은 "맑음"이지만 비 아이콘·얼굴이라 시안 오타로 보고 "비"로 둔다
    weather: "비",
    name: "방전 직전",
    description: "핵심만 쏙. 딱 필요한 소식만 챙겨요.",
    Face: ConditionFaceRainIllustration,
    WeatherIcon: WeatherRainIcon,
  },
];
