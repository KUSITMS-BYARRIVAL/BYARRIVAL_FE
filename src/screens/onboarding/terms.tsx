import { Image } from "expo-image";
import { router, useFocusEffect } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useState } from "react";
import { BackHandler, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/button/button";
import { LoadingDots } from "@/components/loading-dots/loading-dots";
import { useAgreeTerms } from "@/hooks/mutations/use-agree-terms";
import { useGetTerms } from "@/hooks/queries/use-get-terms";
import type { TermsResponse } from "@/types/user/user.types";

import { TermsCheckRow } from "./_components/terms-check-row";

const illustration = require("@/assets/images/terms-illustration.png");

// Figma 문구에 맞춰 종류별로 보여준다. 모르는 종류는 서버 제목을 쓴다
const TERMS_LABEL: Record<string, string> = {
  SERVICE: "이용약관 동의",
  PRIVACY: "개인정보 처리방침 동의",
};
// [임시] 서버에 마케팅 약관이 없어 화면에서만 체크한다 (서버에 보내지 않음)
const MARKETING_LABEL = "[선택] 마케팅·이벤트 알림 수신";

const labelOf = ({ type, title, required }: TermsResponse) =>
  `${required ? "[필수]" : "[선택]"} ${TERMS_LABEL[type] ?? title}`;

// 화면설계서 ONB-03 약관 동의: 로그인 후 필수 약관에 동의해야 닉네임 입력으로 넘어간다
export function TermsScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const { data: terms = [], isPending, isError, refetch } = useGetTerms();
  const { mutate: agree, isPending: isAgreeing } = useAgreeTerms();
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [isMarketingChecked, setIsMarketingChecked] = useState(false);

  // 어두운 배경이라 이 화면에 있는 동안만 상태바 글자를 밝게 한다
  // 리렌더마다 다시 실행되지 않게 고정한다 (실행될 때마다 상태바가 깜빡인다)
  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle("light");
      // Android 뒤로가기로 동의 없이 아래 닉네임으로 가지 못하게 막는다
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => true,
      );
      return () => {
        setStatusBarStyle("dark");
        subscription.remove();
      };
    }, []),
  );

  const isAllChecked =
    terms.length > 0 &&
    checkedIds.length === terms.length &&
    isMarketingChecked;
  const canAgree =
    terms.length > 0 &&
    terms.every(
      ({ termsId, required }) => !required || checkedIds.includes(termsId),
    );

  const toggle = (termsId: number) =>
    setCheckedIds((ids) =>
      ids.includes(termsId)
        ? ids.filter((id) => id !== termsId)
        : [...ids, termsId],
    );
  const toggleAll = () => {
    setCheckedIds(isAllChecked ? [] : terms.map(({ termsId }) => termsId));
    setIsMarketingChecked(!isAllChecked);
  };
  const view = (url: string) => {
    // 서버가 준 주소라도 https 본문만 연다
    if (url.startsWith("https://")) WebBrowser.openBrowserAsync(url);
  };

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: top }}>
      <ScrollView contentContainerClassName="gap-5 pb-5">
        <Image
          source={illustration}
          accessibilityIgnoresInvertColors
          className="w-full"
          style={{ aspectRatio: 393 / 406 }}
          contentFit="cover"
        />
        <View className="gap-3.5">
          <View className="gap-3.5 px-5">
            <Text
              accessibilityRole="header"
              className="text-on-fill-default text-heading1-b"
            >
              반가워요!
            </Text>
            <Text className="text-on-fill-muted text-body2-m">
              도착까지와 함께하기 위해 약관에 동의해주세요!
            </Text>
          </View>
          {isPending ? (
            <LoadingDots className="py-10" />
          ) : isError ? (
            // 약관이 없으면 동의할 수 없어 화면에서 바로 다시 받을 수 있게 한다
            <View className="items-center gap-3 py-10">
              <Text className="text-on-fill-muted text-body2-m">
                약관을 불러오지 못했어요
              </Text>
              <Pressable
                accessibilityRole="button"
                hitSlop={12}
                onPress={() => refetch()}
              >
                <Text className="text-on-fill-default underline text-body2-m">
                  다시 시도
                </Text>
              </Pressable>
            </View>
          ) : (
            <View className="gap-3.5 px-5 py-3">
              <TermsCheckRow
                label="약관 전체 동의"
                isAll
                isChecked={isAllChecked}
                onToggle={toggleAll}
              />
              <View className="gap-3">
                {terms.map((item) => (
                  <TermsCheckRow
                    key={item.termsId}
                    label={labelOf(item)}
                    isChecked={checkedIds.includes(item.termsId)}
                    onToggle={() => toggle(item.termsId)}
                    onView={() => view(item.contentUrl)}
                  />
                ))}
                <TermsCheckRow
                  label={MARKETING_LABEL}
                  isChecked={isMarketingChecked}
                  onToggle={() => setIsMarketingChecked((value) => !value)}
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <View
        className="px-5 pt-2"
        style={{ paddingBottom: Math.max(bottom, 30) }}
      >
        {/* [임시] Figma에 다음 버튼이 없어 다른 온보딩 화면과 같은 버튼을 둔다 */}
        <Button
          label="다음으로"
          size="l"
          color="brand"
          disabled={!canAgree || isAgreeing}
          onPress={() =>
            agree(
              {
                agreements: terms.map(({ termsId }) => ({
                  termsId,
                  agreed: checkedIds.includes(termsId),
                })),
              },
              // 아래에 깔린 닉네임으로 돌아가 약관 화면을 스택에서 뺀다 (뒤로 가도 다시 나오지 않게)
              { onSuccess: () => router.dismissTo("/nickname") },
            )
          }
        />
      </View>
    </View>
  );
}
