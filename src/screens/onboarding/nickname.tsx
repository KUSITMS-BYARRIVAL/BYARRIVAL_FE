import { router } from "expo-router";
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
import { NicknamePreviewCard } from "@/screens/onboarding/_components/nickname-preview-card";
import { useOnboardingStore } from "@/stores/onboarding-store";

import { DEFAULT_NICKNAME, ONBOARDING_STEPS } from "./constants";

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
  const trimmed = nickname.trim();
  const errorMessage = trimmed ? validateNickname(trimmed) : null;
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
              onChangeText={setNickname}
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
        style={{ paddingBottom: Math.max(bottom, 20) }}
      >
        {/* Figma 온보딩 다음 버튼은 neutral(검정), 비활성이면 회색·흰 글자 */}
        <Button
          label="다음으로"
          size="l"
          color="neutral"
          disabled={!isValid}
          // TODO: 금칙어("사용할 수 없는 닉네임이에요")는 서버 검사 API 확정 후 연결
          onPress={() => {
            setNickname(trimmed);
            router.push("/user-type");
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
