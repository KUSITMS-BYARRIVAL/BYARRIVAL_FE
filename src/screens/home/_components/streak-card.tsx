import { Pressable, type PressableProps, Text, View } from "react-native";

import {
  BearWorkerIllustration,
  HomeStreakBackgroundIllustration,
} from "@/assets/illustrations";
import { cn } from "@/lib/cn";

type StreakCardProps = Omit<PressableProps, "children"> & {
  nickname: string;
  streakDays: number;
  longestDays: number;
  className?: string;
};

export function StreakCard({
  nickname,
  streakDays,
  longestDays,
  className,
  ...props
}: StreakCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={cn("h-[175px] overflow-hidden rounded", className)}
      {...props}
    >
      {({ pressed }) => (
        <>
          {/* 배경 그라데이션·빌딩은 Figma에서 한 장으로 내보낸 그림. 카드 너비가 달라져도 오른쪽 기준으로 꽉 채운다 */}
          <HomeStreakBackgroundIllustration
            width="100%"
            height="100%"
            preserveAspectRatio="xMaxYMid slice"
            style={{ position: "absolute" }}
          />
          <BearWorkerIllustration
            style={{ position: "absolute", right: 0, top: 23 }}
          />
          <View className="flex-1 justify-between p-5">
            <View className="gap-2">
              <Text className="text-on-fill-default text-title3-sb">
                {nickname}님과의 출근길
              </Text>
              <View className="flex-row items-center gap-px">
                <Text className="text-on-fill-default text-display1-b">
                  {streakDays}
                </Text>
                <Text className="text-on-fill-default text-title2-sb">
                  일 연속
                </Text>
              </View>
            </View>
            <Text className="text-on-fill-default text-body3-r">
              최장 {longestDays}일
            </Text>
          </View>
          {pressed && <View className="absolute inset-0 bg-card-pressed" />}
        </>
      )}
    </Pressable>
  );
}
