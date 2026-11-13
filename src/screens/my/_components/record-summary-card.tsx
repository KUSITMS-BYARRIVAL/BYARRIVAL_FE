import { Text, View } from "react-native";

import { cn } from "@/lib/cn";

type RecordSummaryCardProps = {
  year: number;
  streakDays: number;
  readCount: number;
  readHours: number;
  longestStreakDays: number;
};

export function RecordSummaryCard({
  year,
  streakDays,
  readCount,
  readHours,
  longestStreakDays,
}: RecordSummaryCardProps) {
  const rows = [
    [
      { label: "연속 완주", value: `${streakDays}일`, isHighlighted: true },
      { label: "올해 읽은 기사", value: `${readCount}개` },
    ],
    [
      { label: "올해 읽은 시간", value: `${readHours}시간` },
      { label: "최장 연속 완주", value: `${longestStreakDays}일` },
    ],
  ];

  return (
    <View className="gap-3 rounded bg-card-white p-5">
      <View className="flex-row items-start justify-between">
        <Text className="text-primary text-title2-sb">나의 기록 요약</Text>
        <Text className="text-tertiary text-caption1-m">{year}년</Text>
      </View>
      <View className="gap-3">
        {rows.map((row, i) => (
          <View key={i} className="flex-row gap-3">
            {row.map(({ label, value, isHighlighted }) => (
              <View
                key={label}
                className={cn(
                  "flex-1 gap-1 rounded-md px-5 py-3",
                  isHighlighted ? "bg-card-brand" : "bg-card-gray",
                )}
              >
                <Text className="text-secondary text-caption1-m">{label}</Text>
                <Text
                  className={cn(
                    "text-title3-sb",
                    isHighlighted ? "text-on-fill-default" : "text-primary",
                  )}
                >
                  {value}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
