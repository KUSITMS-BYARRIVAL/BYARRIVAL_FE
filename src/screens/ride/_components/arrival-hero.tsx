import { View } from "react-native";

import {
  ArrivalSubwayIllustration,
  BearCelebrateIllustration,
} from "@/assets/illustrations";
import { cn } from "@/lib/cn";

type ArrivalHeroProps = {
  className?: string;
};

export function ArrivalHero({ className }: ArrivalHeroProps) {
  return (
    <View className={cn("h-[220px] items-center overflow-hidden", className)}>
      {/* 화면이 좁으면 양옆을 잘라 가운데 곰 위치를 유지한다 */}
      <ArrivalSubwayIllustration
        width="100%"
        height={220}
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute" }}
      />
      <BearCelebrateIllustration style={{ marginTop: 56 }} />
    </View>
  );
}
