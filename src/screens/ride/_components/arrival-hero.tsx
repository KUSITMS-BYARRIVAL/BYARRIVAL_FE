import { View } from "react-native";

import {
  ArrivalBearOtherIllustration,
  ArrivalBearStudentIllustration,
  ArrivalBearWorkerIllustration,
  ArrivalSubwayIllustration,
} from "@/assets/illustrations";
import { cn } from "@/lib/cn";
import type { UserType } from "@/stores/onboarding-store";

const BEAR_BY_USER_TYPE = {
  worker: ArrivalBearWorkerIllustration,
  student: ArrivalBearStudentIllustration,
  other: ArrivalBearOtherIllustration,
} satisfies Record<UserType, unknown>;

type ArrivalHeroProps = {
  userType: UserType;
  className?: string;
};

export function ArrivalHero({ userType, className }: ArrivalHeroProps) {
  const Bear = BEAR_BY_USER_TYPE[userType];
  return (
    <View className={cn("h-[220px] items-center overflow-hidden", className)}>
      {/* 화면이 좁으면 양옆을 잘라 가운데 곰 위치를 유지한다 */}
      <ArrivalSubwayIllustration
        width="100%"
        height={220}
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute" }}
      />
      {/* Figma 프레임 기준 위치(top 58)에서 곰과 양옆 반짝이를 함께 그린다 */}
      <Bear testID={`arrival-bear-${userType}`} style={{ marginTop: 58 }} />
    </View>
  );
}
