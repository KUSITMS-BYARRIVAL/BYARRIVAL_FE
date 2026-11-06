import { router } from "expo-router";
import type { ComponentType } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { SvgProps } from "react-native-svg";

import {
  CategoryCounselIcon,
  CategoryCounselSelectedIcon,
  CategoryDeliveryIcon,
  CategoryDeliverySelectedIcon,
  CategoryDesignIcon,
  CategoryDesignSelectedIcon,
  CategoryEtcIcon,
  CategoryEtcSelectedIcon,
  CategoryFinanceIcon,
  CategoryFinanceSelectedIcon,
  CategoryHumanResourcesIcon,
  CategoryHumanResourcesSelectedIcon,
  CategoryLaptopIcon,
  CategoryLaptopSelectedIcon,
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
} from "@/assets/icons";
import { Button } from "@/components/button/button";
import { Header } from "@/components/header/header";
import { ProgressStepper } from "@/components/progress-stepper/progress-stepper";
import { SelectionTile } from "@/screens/onboarding/_components/selection-tile";
import {
  type JobGroup,
  type UserType,
  useOnboardingStore,
} from "@/stores/onboarding-store";
import { cn } from "@/lib/cn";

import { ONBOARDING_STEPS } from "./constants";

// 화면설계서 ONB-09 4: 12개 분류, 3열 × 4행
const JOB_GROUPS: {
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

// 화면설계서 ONB-09 T1~T3: 학생만 희망 직군으로 묻고, 기타는 직장인 문구를 쓴다
const WORKER_COPY = {
  title: "어떤 일을 하고 계신가요?",
  description: "직군에 맞는 뉴스와 출근길 콘텐츠를 추천해 드려요",
};
const COPY: Record<UserType, { title: string; description: string }> = {
  worker: WORKER_COPY,
  student: {
    title: "어떤 직무를 희망하시나요?",
    description:
      "해당 직군에 재직 중인 사람들이 관심있게 보는 뉴스와 출근길 콘텐츠를 추천해 드려요",
  },
  other: WORKER_COPY,
};

// 화면설계서 ONB-09 직군 선택
export function JobGroupScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const userType = useOnboardingStore((state) => state.userType);
  const jobGroup = useOnboardingStore((state) => state.jobGroup);
  const setJobGroup = useOnboardingStore((state) => state.setJobGroup);
  const copy = COPY[userType ?? "worker"];

  return (
    <View className="flex-1 bg-default" style={{ paddingTop: top }}>
      {/* 화면설계서: 뒤로 → ONB-08 */}
      <Header onBack={() => router.back()} />
      <ScrollView className="flex-1" contentContainerClassName="gap-5 pt-3.5">
        <ProgressStepper
          total={ONBOARDING_STEPS}
          current={6}
          showVehicle
          className="mx-5"
        />
        <View className="gap-3.5">
          <View className="gap-1.5 px-5">
            <Text
              accessibilityRole="header"
              className="text-primary text-title1-sb"
            >
              {copy.title}
            </Text>
            <Text className="text-tertiary text-body2-m">
              {copy.description}
            </Text>
          </View>
          <View>
            {/* 화면설계서 ONB-09 3: 미선택 안내 / 선택 시 초록 "1개 선택됨" */}
            <Text
              accessibilityLiveRegion="polite"
              className={cn(
                "h-[31px] px-5 text-body2-m",
                jobGroup ? "text-brand" : "text-tertiary",
              )}
            >
              {jobGroup ? "1개 선택됨" : "직군을 하나 골라 주세요"}
            </Text>
            <View className="gap-9 px-5 pb-3">
              {/* 단일 선택: 다른 직군을 누르면 선택이 바뀐다 */}
              <View
                accessibilityRole="radiogroup"
                className="flex-row flex-wrap justify-between gap-y-2"
              >
                {JOB_GROUPS.map(
                  ({ value, title, example, Icon, SelectedIcon }) => {
                    const isSelected = jobGroup === value;
                    const TileIcon = isSelected ? SelectedIcon : Icon;
                    return (
                      <SelectionTile
                        key={value}
                        accessibilityRole="radio"
                        size="s"
                        icon={<TileIcon />}
                        title={title}
                        subtitle={example}
                        isSelected={isSelected}
                        className="w-[32%]"
                        onPress={() => setJobGroup(value)}
                      />
                    );
                  },
                )}
              </View>
              <Text className="text-center text-tertiary text-caption1-r">
                {
                  "같은 지역·직군 분들이 많이 보는 콘텐츠를 보여드리는 데만 써요.\n프로필에서 언제든 바꿀 수 있어요."
                }
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View
        className="px-5 pt-2"
        style={{ paddingBottom: Math.max(bottom, 20) }}
      >
        <Button
          label="다음으로"
          size="l"
          color="neutral"
          disabled={!jobGroup}
          onPress={() => router.push("/region")}
        />
      </View>
    </View>
  );
}
