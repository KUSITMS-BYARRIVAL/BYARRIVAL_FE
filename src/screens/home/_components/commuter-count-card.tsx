import { Text, View } from "react-native";

import { BusIcon } from "@/assets/icons";
import { cn } from "@/lib/cn";

type CommuterCountCardProps = {
  count: number;
  className?: string;
};

export function CommuterCountCard({
  count,
  className,
}: CommuterCountCardProps) {
  return (
    <View className={cn("gap-2 rounded bg-white px-5 py-3.5", className)}>
      <View className="flex-row items-center gap-1">
        <BusIcon width={24} height={24} />
        <Text className="text-tertiary text-title3-sb">지금 출근하는 사람</Text>
      </View>
      <Text className="text-primary text-title1-sb">
        {count.toLocaleString("ko-KR")}명
      </Text>
    </View>
  );
}
