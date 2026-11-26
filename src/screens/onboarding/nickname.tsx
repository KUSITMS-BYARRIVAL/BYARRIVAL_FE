import { router } from "expo-router";
import { useEffect, useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/button/button";
import { Header } from "@/components/header/header";
import { ProgressStepper } from "@/components/progress-stepper/progress-stepper";
import { TextField } from "@/components/text-field/text-field";
import { useUpdateOnboarding } from "@/hooks/mutations/use-update-onboarding";
import { useGetCategories } from "@/hooks/queries/use-get-categories";
import { useGetOnboarding } from "@/hooks/queries/use-get-onboarding";
import { toInterests } from "@/screens/_helpers";
import { NicknamePreviewCard } from "@/screens/onboarding/_components/nickname-preview-card";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { useToastStore } from "@/stores/toast-store";

import { DEFAULT_NICKNAME, ONBOARDING_STEPS } from "./_constants";
import { toOnboardingDraft } from "./_helpers";

// 중간에 이탈했다 돌아오면 서버에 저장된 값으로 초안을 1번 채운다 (첫 화면에서만)
// 관심 분야만 카테고리 목록이 필요해, 목록 조회가 실패해도 나머지 값은 복원되도록 따로 채운다
function useResumeOnboarding() {
  const { data: onboarding } = useGetOnboarding();
  const { data: categories } = useGetCategories();
  const hydrate = useOnboardingStore((state) => state.hydrate);
  const isHydrated = useRef(false);
  const isInterestsHydrated = useRef(false);

  useEffect(() => {
    if (isHydrated.current || !onboarding) return;
    isHydrated.current = true;
    const { nickname, ...rest } = toOnboardingDraft(onboarding);
    // 응답이 오기 전에 입력하기 시작했다면 그 닉네임을 덮어쓰지 않는다
    const isTyping = useOnboardingStore.getState().nickname.length > 0;
    hydrate(isTyping || !nickname ? rest : { ...rest, nickname });
  }, [onboarding, hydrate]);

  useEffect(() => {
    if (isInterestsHydrated.current || !onboarding || !categories) return;
    isInterestsHydrated.current = true;
    const interests = toInterests(onboarding.categoryIds, categories);
    if (interests.length > 0) hydrate({ interests });
  }, [onboarding, categories, hydrate]);
}

// 서버 닉네임 검사 실패 코드 (API 명세 USER-14)
const NICKNAME_ERROR_CODE = "INVALID_NICKNAME";
const NICKNAME_MAX_LENGTH = 10;
const NICKNAME_MIN_LENGTH = 2;
// 한글(조합 중인 자모 포함)·영문·숫자만 허용
const NICKNAME_PATTERN = /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]*$/;

/** 화면설계서 ONB-04 닉네임 규칙. 통과하면 null, 아니면 안내 문구 */
function validateNickname(nickname: string): string | null {
  if (!NICKNAME_PATTERN.test(nickname))
    return "한글, 영문, 숫자만 쓸 수 있어요";
  if (nickname.length < NICKNAME_MIN_LENGTH) return "2자 이상 입력해주세요";
  return null;
}

export function NicknameScreen() {
  const { top, bottom } = useSafeAreaInsets();
  // 입력하는 대로 스토어에 저장해, 다음으로를 누르기 전에 화면을 떠났다 와도 초안이 남는다
  const nickname = useOnboardingStore((state) => state.nickname);
  const setNickname = useOnboardingStore((state) => state.setNickname);
  // 온보딩 소요 시간(onboarding_complete)의 시작. 약관을 거쳐 왔으면 약관 진입 시각이 유지된다
  const markStarted = useOnboardingStore((state) => state.markStarted);
  useEffect(() => markStarted(), [markStarted]);
  useResumeOnboarding();
  const showToast = useToastStore((state) => state.showToast);
  // 닉네임 검사 오류만 입력창 아래에 보여주고, 그 외(네트워크·서버 오류)는 토스트로 알린다
  const { mutate, isPending, error, reset } = useUpdateOnboarding({
    meta: { skipToast: true },
  });
  const fieldError = error?.code === NICKNAME_ERROR_CODE ? error.message : null;
  const trimmed = nickname.trim();
  const errorMessage =
    (trimmed ? validateNickname(trimmed) : null) ?? fieldError;
  // 공백만 입력한 경우도 통과시키지 않는다
  const isValid = trimmed.length > 0 && !errorMessage;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-default"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ paddingTop: top }}
    >
      {/* 화면설계서: 뒤로 → ONB-03 약관 (약관 화면 전까지는 이전 화면) */}
      <Header onBack={() => router.back()} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 pt-3.5"
        keyboardShouldPersistTaps="handled"
      >
        <ProgressStepper
          total={ONBOARDING_STEPS}
          current={1}
          showVehicle
          className="mx-5"
        />
        <View className="gap-9">
          <View className="gap-1.5 px-5">
            <Text
              accessibilityRole="header"
              className="text-primary text-title1-sb"
            >
              어떻게 불러드릴까요?
            </Text>
            <Text className="text-tertiary text-body2-m">
              {
                "더 친근한 서비스 경험을 위해 닉네임을 정해주세요.\n언제든지 변경할 수 있어요."
              }
            </Text>
          </View>
          <View className="px-5">
            <NicknamePreviewCard nickname={trimmed || DEFAULT_NICKNAME} />
            <TextField
              className="py-5"
              value={nickname}
              onChangeText={(text) => {
                setNickname(text);
                reset();
              }}
              maxLength={NICKNAME_MAX_LENGTH}
              placeholder="닉네임을 입력하세요"
              error={!!errorMessage}
              helperText={errorMessage ?? "예시: 출근러, 김철수, 아침형인간"}
              accessibilityLabel="닉네임"
              returnKeyType="done"
            />
          </View>
        </View>
      </ScrollView>
      <View
        className="px-5 pt-2"
        style={{ paddingBottom: Math.max(bottom, 30) }}
      >
        {/* Figma 온보딩 다음 버튼은 neutral(검정), 비활성이면 회색·흰 글자 */}
        <Button
          label="다음으로"
          size="l"
          color="neutral"
          disabled={!isValid || isPending}
          onPress={() => {
            setNickname(trimmed);
            mutate(
              { nickname: trimmed },
              {
                onSuccess: () => router.push("/user-type"),
                onError: ({ code, message }) => {
                  if (code !== NICKNAME_ERROR_CODE) showToast({ message });
                },
              },
            );
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
