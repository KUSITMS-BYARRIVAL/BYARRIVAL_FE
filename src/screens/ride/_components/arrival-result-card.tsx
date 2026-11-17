import { Text, View } from "react-native";

import { cn } from "@/lib/cn";

type ArrivalResultCardProps = {
  /** 원문 보기를 누른 기사 수 */
  readCount: number;
  streakDays: number;
  className?: string;
};

// 모두 읽어야 도착할 수 있어 완독 배지는 두지 않는다
export function ArrivalResultCard({
  readCount,
  streakDays,
  className,
}: ArrivalResultCardProps) {
  return (
    <View className={cn("gap-4 rounded bg-card-green p-5", className)}>
      <View className="flex-row items-center justify-between">
        <Text className="text-secondary text-title3-sb">읽은 기사</Text>
        <Text className="text-primary text-title3-sb">{readCount}개</Text>
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-secondary text-title3-sb">연속 이용</Text>
        <Text className="text-primary text-title3-sb">{streakDays}일째</Text>
      </View>
    </View>
  );
}
