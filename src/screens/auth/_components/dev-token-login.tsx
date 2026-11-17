import { useState } from "react";
import { Pressable, Text } from "react-native";

import { BottomSheet } from "@/components/bottom-sheet/bottom-sheet";
import { TextField } from "@/components/text-field/text-field";
import { useQueryClient } from "@tanstack/react-query";

import { getMeQuery } from "@/hooks/queries/use-get-me";
import { useAuthStore } from "@/stores/auth-store";
import { useToastStore } from "@/stores/toast-store";

// 개발 빌드 전용: 소셜 로그인 없이 백엔드에서 받은 테스트 토큰으로 로그인 상태를 만든다
// shortcut: 화면에서만 붙여넣고 코드·파일에는 토큰을 두지 않는다. 테스트 로그인 API가 생기면 교체
export function DevTokenLogin() {
  const queryClient = useQueryClient();
  const setTokens = useAuthStore((state) => state.setTokens);
  const startSession = useAuthStore((state) => state.startSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const showToast = useToastStore((state) => state.showToast);
  const [isOpen, setIsOpen] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const canSubmit = accessToken.trim() !== "" && refreshToken.trim() !== "";

  const submit = async () => {
    if (!canSubmit) return;
    try {
      // 이전 계정의 캐시 · 온보딩 초안이 섞이지 않게 비우고 시작한다
      await clearSession();
      const tokens = {
        accessToken: accessToken.trim(),
        refreshToken: refreshToken.trim(),
      };
      // 토큰을 먼저 넣어야 내 정보를 받을 수 있다. 받은 온보딩 완료 여부로 가드가 온보딩 / 홈을 고른다
      await setTokens(tokens);
      const me = await queryClient.fetchQuery(getMeQuery);
      setIsOpen(false);
      await startSession({ tokens, isOnboarded: me.onboardingCompleted });
    } catch {
      await clearSession();
      showToast({ message: "토큰으로 로그인하지 못했어요" });
    }
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="개발용 토큰 로그인"
        className="absolute bottom-10 right-5 rounded-full bg-white/80 px-3 py-2"
        onPress={() => setIsOpen(true)}
      >
        <Text className="text-primary text-caption1-r">DEV</Text>
      </Pressable>
      <BottomSheet
        visible={isOpen}
        title="토큰으로 로그인"
        onClose={() => setIsOpen(false)}
        buttonLabel="로그인"
        onButtonPress={submit}
      >
        <TextField
          value={accessToken}
          onChangeText={setAccessToken}
          placeholder="accessToken"
          accessibilityLabel="accessToken"
          autoCapitalize="none"
          autoCorrect={false}
          className="px-5"
        />
        <TextField
          value={refreshToken}
          onChangeText={setRefreshToken}
          placeholder="refreshToken"
          accessibilityLabel="refreshToken"
          autoCapitalize="none"
          autoCorrect={false}
          className="px-5 pt-3"
        />
      </BottomSheet>
    </>
  );
}
