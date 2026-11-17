import { Text, View } from "react-native";

import { BarChart } from "./bar-chart";

type WeeklyRecordCardProps = {
  /** 오래된 주 → 이번 주 순서의 읽은 시간(분). 마지막이 이번 주 */
  weeklyMinutes: number[];
};

export function WeeklyRecordCard({ weeklyMinutes }: WeeklyRecordCardProps) {
  const [lastWeek = 0, thisWeek = 0] = weeklyMinutes.slice(-2);
  const lastWeekDiff = thisWeek - lastWeek;

  return (
    <View className="gap-3.5 rounded bg-white p-5">
      <View className="flex-row items-center justify-between">
        <Text className="text-primary text-title2-sb">쌓이는 기록</Text>
        <Text className="text-tertiary text-caption1-m">
          최근 {weeklyMinutes.length}주 읽은 시간
        </Text>
      </View>
      <View className="gap-3">
        <BarChart weeklyMinutes={weeklyMinutes} />
        {/* 사양: 지난주보다 늘었을 때만 보여주고, 줄었거나 같으면 문구 없음 */}
        {lastWeekDiff > 0 && (
          <View className="items-center rounded-md bg-green-50 p-2.5">
            <Text className="text-brand text-body2-m">
              지난주보다 {lastWeekDiff}분 더 읽었어요. 꾸준히 늘고 있어요!
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
