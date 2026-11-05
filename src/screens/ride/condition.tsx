import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  WeatherCloudyIllustration,
  WeatherDefaultIllustration,
  WeatherRainIllustration,
  WeatherSunnyIllustration,
} from "@/assets/illustrations";
import { Badge } from "@/components/badge/badge";
import { Button } from "@/components/button/button";
import { Header } from "@/components/header/header";
import { Slider } from "@/components/slider/slider";
import { CONDITIONS, RIDE_DATE_LABEL } from "@/mocks/ride";

// CONDITIONS 순서(비 · 흐림 · 보통 · 맑음)와 맞춘다
const WEATHER_ILLUSTRATIONS = [
  WeatherRainIllustration,
  WeatherCloudyIllustration,
  WeatherDefaultIllustration,
  WeatherSunnyIllustration,
];

export function ConditionScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const [level, setLevel] = useState(CONDITIONS.length - 1);
  const condition = CONDITIONS[level];
  const WeatherIllustration = WEATHER_ILLUSTRATIONS[level];

  return (
    <View className="flex-1 bg-grey-100" style={{ paddingTop: top }}>
      <Header title="컨디션" onBack={router.back} />
      <View className="flex-1 items-center justify-between p-5">
        <View className="w-full gap-3.5">
          <Badge label={RIDE_DATE_LABEL} size="m" className="self-start" />
          <View className="gap-1.5">
            {/* Figma Heading1/B(24px·140%·-2%)와 일치하는 토큰이 없어 가장 가까운 heading2-b를 쓴다 */}
            <Text className="text-strong text-heading2-b">
              오늘은 어떤 컨디션인가요?
            </Text>
            <Text className="text-secondary text-body1-m">
              날씨처럼 오늘 기분을 골라보세요.
            </Text>
          </View>
        </View>
        <WeatherIllustration width={210} height={210} />
        {/* Slider 높이 24px 중 트랙(6px) 위아래 9px 여백을 빼서 Figma 간격(36 · 12)을 맞춘다 */}
        <View className="w-full gap-[27px] pb-2.5">
          <View className="w-[250px] gap-3">
            <Text className="text-tertiary text-body2-m">
              {condition.weather} · 오늘의 기분
            </Text>
            <View className="gap-1">
              <Text className="text-primary text-heading2-b">
                {condition.name}
              </Text>
              <Text className="text-secondary text-body1-m">
                {condition.description}
              </Text>
            </View>
          </View>
          <View className="gap-[3px]">
            <Slider
              value={level}
              stepCount={CONDITIONS.length}
              onValueChange={setLevel}
              accessibilityLabel={`오늘의 컨디션, ${condition.weather}`}
            />
            {/* 라벨을 손잡이(24px)와 같은 칸에 두어 각 단계의 손잡이 중심에 맞춘다. 글자는 칸보다 넓을 수 있어 고정 너비로 넘치게 둔다 */}
            <View className="flex-row justify-between">
              {CONDITIONS.map(({ weather }) => (
                <View key={weather} className="w-6 items-center">
                  <Text className="w-10 text-center text-secondary text-body3-m">
                    {weather}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
      {/* Figma 30px은 홈 인디케이터 영역을 포함한 값이라 더하지 않고, 안전 영역이 더 큰 기기(Android 3버튼 내비 등)만 그만큼 띄운다 */}
      <View className="px-5" style={{ paddingBottom: Math.max(bottom, 30) }}>
        <Button
          label="시작하기"
          color="neutral"
          size="l"
          onPress={() => router.push("/ride/select")}
        />
      </View>
    </View>
  );
}
