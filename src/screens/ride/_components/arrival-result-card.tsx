import { Text, View } from "react-native";

import { Badge } from "@/components/badge/badge";
import { cn } from "@/lib/cn";

type ArrivalResultCardProps = {
  /** 원문 보기를 누른 기사 수 */
  readCount: number;
  /** 탑승한 기사 전체 수 */
  total: number;
  streakDays: number;
  className?: string;
};

export function ArrivalResultCard({
  readCount,
  total,
  streakDays,
  className,
}: ArrivalResultCardProps) {
  return (
    <View
      className={cn(
        "gap-4 rounded border border-brand bg-card-green p-5",
        className,
      )}
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-secondary text-title3-sb">읽은 기사</Text>
        <View className="flex-row items-center gap-2">
          {/* 하나도 안 읽었을 때 배지를 숨기는 건 임시 — 기획 확인 필요 */}
          {readCount > 0 && (
            <Badge label={readCount >= total ? "모두 완독" : "부분 완독"} />
          )}
          <Text className="text-primary text-title3-sb">{readCount}개</Text>
        </View>
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-secondary text-title3-sb">연속 이용</Text>
        <Text className="text-primary text-title3-sb">{streakDays}일째</Text>
      </View>
    </View>
  );
}
