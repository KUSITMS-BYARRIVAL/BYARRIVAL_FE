import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { OnboardingCommuteIllustration } from "@/assets/illustrations";
import { BottomSheet } from "@/components/bottom-sheet/bottom-sheet";
import { Button } from "@/components/button/button";
import { Dialog } from "@/components/dialog/dialog";
import { Header } from "@/components/header/header";
import { ProgressStepper } from "@/components/progress-stepper/progress-stepper";
import { type Time, TimePicker } from "@/components/time-picker/time-picker";
import { TimeSelector } from "@/components/time-selector/time-selector";
import { type UserType, useOnboardingStore } from "@/stores/onboarding-store";

import { ONBOARDING_STEPS } from "./constants";

// Figma 지하철 좌석 일러스트(393×279) 비율
const ILLUSTRATION_ASPECT_RATIO = 393 / 279;

// 화면설계서 ONB-06 T1: 유형별 헤드라인·설명
// notice: 알림 권한 안내(N1) 제목. 학생·기타에게 "출근"이 보이지 않게 유형별로 바꾼다
const COPY: Record<
  UserType,
  { title: string; description: string; notice: string }
> = {
  worker: {
    title: "출근은 보통 언제하시나요?",
    description: "출근하는 날 중 가장 일찍 출발하는 날 기준으로 알려주세요.",
    notice: "출근 10분 전에 오늘의 노선을 알려드릴게요",
  },
  student: {
    title: "등교는 보통 언제하시나요?",
    description: "등교하는 날 중 가장 일찍 출발하는 날 기준으로 알려주세요.",
    notice: "등교 10분 전에 오늘의 노선을 알려드릴게요",
  },
  other: {
    title: "보통 언제 출발하시나요?",
    description: "이동하는 날 중 가장 일찍 출발하는 날 기준으로 알려주세요.",
    notice: "출발 10분 전에 오늘의 노선을 알려드릴게요",
  },
};

// 화면설계서 ONB-06 출근 시각 설정
export function DepartureTimeScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const userType = useOnboardingStore((state) => state.userType);
  const departureTime = useOnboardingStore((state) => state.departureTime);
  const setDepartureTime = useOnboardingStore(
    (state) => state.setDepartureTime,
  );
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  // 바텀시트에서 휠을 돌리는 동안의 값. 확인을 눌러야 저장한다
  const [draftTime, setDraftTime] = useState<Time>(departureTime);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const copy = COPY[userType ?? "worker"];

  const openPicker = () => {
    setDraftTime(departureTime);
    setIsPickerOpen(true);
  };

  const goNext = () => {
    setIsNoticeOpen(false);
    router.push("/travel-time");
  };

  return (
    <View className="flex-1 bg-default" style={{ paddingTop: top }}>
      {/* 화면설계서: 뒤로 → ONB-05, 고른 유형은 스토어에 남아 유지된다 */}
      <Header onBack={() => router.back()} />
      <ScrollView className="flex-1" contentContainerClassName="gap-5 pt-3.5">
        <ProgressStepper
          total={ONBOARDING_STEPS}
          current={3}
          showVehicle
          className="mx-5"
        />
        <View className="gap-9">
          {/* TODO: 학생·기타 유형 캐릭터 일러스트는 디자인이 나오면 교체 (화면설계서 ONB-06 T2) */}
          <View style={{ aspectRatio: ILLUSTRATION_ASPECT_RATIO }}>
            <OnboardingCommuteIllustration width="100%" height="100%" />
          </View>
          <View className="gap-9">
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
            <TimeSelector
              hour={departureTime.hour}
              minute={departureTime.minute}
              accessibilityHint="눌러서 시각을 바꿀 수 있어요"
              className="mx-5"
              onPress={openPicker}
            />
          </View>
        </View>
      </ScrollView>
      <View
        className="px-5 pt-2"
        style={{ paddingBottom: Math.max(bottom, 30) }}
      >
        {/* 기본값(08:00)이 있어 처음부터 활성 */}
        <Button
          label="다음으로"
          size="l"
          color="neutral"
          onPress={() => setIsNoticeOpen(true)}
        />
      </View>

      <BottomSheet
        visible={isPickerOpen}
        title="시간 설정"
        onClose={() => setIsPickerOpen(false)}
        buttonLabel="확인"
        onButtonPress={() => {
          setDepartureTime(draftTime);
          setIsPickerOpen(false);
        }}
      >
        <TimePicker value={draftTime} onChange={setDraftTime} />
      </BottomSheet>

      {/* 화면설계서 ONB-06 N1 알림 권한 사전 안내 */}
      {/* TODO: [알림 받기]는 OS 알림 권한 요청, 거부 시 "마이 > 알림에서 언제든 켤 수 있어요" 토스트 (expo-notifications 도입 후) */}
      <Dialog
        visible={isNoticeOpen}
        title={copy.notice}
        confirmLabel="알림 받기"
        onConfirm={goNext}
        cancelLabel="나중에"
        onCancel={goNext}
      />
    </View>
  );
}
