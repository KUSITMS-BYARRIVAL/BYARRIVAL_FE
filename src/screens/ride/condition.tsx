import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Badge } from "@/components/badge/badge";
import { Button } from "@/components/button/button";
import { Header } from "@/components/header/header";

import { ConditionCard } from "./_components/condition-card";
import { CONDITIONS } from "./_constants";

export function ConditionScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <View className="flex-1 bg-grey-100" style={{ paddingTop: top }}>
      <Header title="탑승 준비" onBack={router.back} />
      <View className="flex-1 gap-9 p-5">
        <View className="gap-3.5">
          <Badge label="10월 10일 토요일" size="m" className="self-start" />
          <View className="gap-1.5">
            {/* Figma Heading1/B(24px·140%·-2%)와 일치하는 토큰이 없어 가장 가까운 heading2-b를 쓴다 */}
            <Text className="text-strong text-heading2-b">
              오늘은 어떤 컨디션인가요?
            </Text>
            <Text className="text-secondary text-body1-m">
              고른 컨디션에 따라 기사 분량과 난이도가 달라져요.
            </Text>
          </View>
        </View>
        <View accessibilityRole="radiogroup" className="gap-2">
          {CONDITIONS.map(
            ({ weather, name, description, Face, WeatherIcon }, index) => (
              <ConditionCard
                key={weather}
                face={<Face />}
                weatherIcon={<WeatherIcon />}
                weather={weather}
                name={name}
                description={description}
                isSelected={index === selectedIndex}
                onPress={() => setSelectedIndex(index)}
              />
            ),
          )}
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
