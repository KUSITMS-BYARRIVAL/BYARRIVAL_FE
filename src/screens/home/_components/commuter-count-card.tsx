import { Text, View } from "react-native";

import { BusIcon } from "@/assets/icons";
import { cn } from "@/lib/cn";

type CommuterCountCardProps = {
  count: number;
  /** 유형별 이동 이름 (출근 · 등교 · 이동) */
  commute: string;
  className?: string;
};

export function CommuterCountCard({
  count,
  commute,
  className,
}: CommuterCountCardProps) {
  return (
    <View className={cn("gap-2 rounded bg-white px-5 py-3.5", className)}>
      <View className="flex-row items-center gap-1">
        <BusIcon width={24} height={24} />
        <Text className="text-tertiary text-title3-sb">
          지금 {commute}하는 사람
        </Text>
      </View>
      <Text className="text-primary text-title1-sb">
        {count.toLocaleString("ko-KR")}명
      </Text>
    </View>
  );
}
