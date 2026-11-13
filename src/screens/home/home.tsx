import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SubwaySideIcon } from "@/assets/icons";
import { LogoIllustration } from "@/assets/illustrations";
import { AlarmButton } from "@/screens/_components/alarm-button";
import { Button } from "@/components/button/button";
import {
  BOARDING_ARTICLES,
  COMMUTER_COUNT,
  HOME_NICKNAME,
  HOME_JOB_GROUP,
  HOME_RIDE_STATUS,
  HOME_SMALLTALK,
  HOME_STREAK,
  HOME_TRENDING,
  IS_TRENDING_READY,
  RESUME_STOP,
} from "@/mocks/ride";
import { CommuterCountCard } from "@/screens/home/_components/commuter-count-card";
import { EditorPickSection } from "@/screens/home/_components/editor-pick-section";
import { StreakCard } from "@/screens/home/_components/streak-card";
import { TrendingSection } from "@/screens/home/_components/trending-section";
import { COMMUTE_WORDS } from "@/screens/_constants";
import { useOnboardingStore } from "@/stores/onboarding-store";

// TODO: 쉬는 날(프로필 0분) '오늘은 쉬는 날이에요. 그래도 읽어볼까요?' 상태 (UT 이후)
const RIDE_BUTTON = {
  idle: {
    label: "뉴스 탑승 시작하기",
    onPress: () => router.push("/ride/condition"),
  },
  paused: {
    label: `이어서 탑승하기 (${RESUME_STOP}/${BOARDING_ARTICLES.length})`,
    onPress: () =>
      router.push({
        pathname: "/ride/stop",
        params: { start: RESUME_STOP - 1 },
      }),
  },
  // TODO: 지금은 임시로 도착 화면
  completed: {
    label: "오늘 노선 다시 보기",
    onPress: () => router.push("/ride/arrival"),
  },
};

export function HomeScreen() {
  const { top } = useSafeAreaInsets();
  const rideButton = RIDE_BUTTON[HOME_RIDE_STATUS];
  // 온보딩을 거치지 않고 홈에 온 경우(개발 중 새로고침 등)는 직장인 문구로 보여준다
  const userType = useOnboardingStore((state) => state.userType) ?? "worker";
  const { commute, route } = COMMUTE_WORDS[userType];

  return (
    <View className="flex-1 bg-default" style={{ paddingTop: top }}>
      <View className="mt-3.5 h-6 flex-row items-center justify-between px-5">
        <LogoIllustration />
        <AlarmButton />
      </View>
      <ScrollView className="flex-1" contentContainerClassName="gap-9 p-5">
        <View className="gap-3.5">
          <View className="gap-2">
            {/* Figma는 22px Bold(140%·-2%)지만 같은 토큰이 없어 heading2-b(24px·135%)를 쓴다 */}
            <Text className="text-primary text-heading2-b">
              {HOME_NICKNAME}님 좋은 아침이에요!
            </Text>
            <Text className="text-secondary text-body2-m">
              오늘도 우리 모두 {commute} 중이에요
            </Text>
          </View>
          <StreakCard nickname={HOME_NICKNAME} route={route} {...HOME_STREAK} />
          <CommuterCountCard count={COMMUTER_COUNT} commute={commute} />
          <Button
            label={rideButton.label}
            size="l"
            color="neutral"
            leadingIcon={<SubwaySideIcon width={30} height={30} />}
            onPress={rideButton.onPress}
          />
        </View>
        <TrendingSection
          jobGroup={HOME_JOB_GROUP}
          route={route}
          articles={HOME_TRENDING}
          isReady={IS_TRENDING_READY}
          onSeeAllPress={() => router.push("/trending")}
          onArticlePress={(url) => WebBrowser.openBrowserAsync(url)}
        />
        <EditorPickSection
          smalltalk={HOME_SMALLTALK}
          onMorePress={() => router.push("/smalltalk")}
          onSmalltalkPress={() =>
            WebBrowser.openBrowserAsync(HOME_SMALLTALK.url)
          }
        />
      </ScrollView>
    </View>
  );
}
