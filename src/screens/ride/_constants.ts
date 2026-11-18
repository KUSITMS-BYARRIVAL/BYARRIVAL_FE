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
import type { Condition } from "@/types/ride/ride.types";

// 컨디션 선택지. Figma 탑승 준비 - 컨디션 카드 순서(위→아래)
export const CONDITIONS: {
  condition: Condition;
  weather: string;
  name: string;
  description: string;
  Face: ComponentType<SvgProps>;
  WeatherIcon: ComponentType<SvgProps>;
}[] = [
  {
    condition: "SUNNY",
    weather: "맑음",
    name: "가뿐해요",
    description: "에너지 충만! 깊이 있는 기사도 거뜬해요!",
    Face: ConditionFaceSunnyIllustration,
    WeatherIcon: WeatherSunnyIcon,
  },
  {
    condition: "NORMAL",
    weather: "보통",
    name: "그저 그래요",
    description: "무난한 하루. 적당한 분량으로 채워요.",
    Face: ConditionFaceDefaultIllustration,
    WeatherIcon: WeatherDefaultIcon,
  },
  {
    condition: "CLOUDY",
    weather: "흐림",
    name: "조금 지쳐요",
    description: "가볍고 짧은 기사 위주로 부담없이 읽어요.",
    Face: ConditionFaceCloudyIllustration,
    WeatherIcon: WeatherCloudyIcon,
  },
  {
    // Figma 라벨은 "맑음"이지만 비 아이콘·얼굴이라 시안 오타로 보고 "비"로 둔다
    condition: "RAINY",
    weather: "비",
    name: "방전 직전",
    description: "핵심만 쏙. 딱 필요한 소식만 챙겨요.",
    Face: ConditionFaceRainIllustration,
    WeatherIcon: WeatherRainIcon,
  },
];

// 뉴스 탑승하기에서 기사를 담을 때 뜨는 토스트 (뺄 때는 띄우지 않는다)
export const ADD_TOAST_MESSAGE = "1정거장이 추가되었어요";

// 추천 기사가 0건이라 노선을 만들지 못했을 때 (POST /routes → EMPTY)
export const EMPTY_ROUTE_MESSAGE = "오늘 준비한 뉴스는 여기까지에요";
