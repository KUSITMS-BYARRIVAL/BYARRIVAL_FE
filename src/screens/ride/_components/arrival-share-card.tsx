import { type ComponentRef, type Ref } from "react";
import { Text, View } from "react-native";

import {
  ArrivalShareBearIllustration,
  ArrivalShareIconIllustration,
  ArrivalSubwayIllustration,
} from "@/assets/illustrations";
import { cn } from "@/lib/cn";
import { PALETTE } from "@/theme/colors";

// Figma 공유 카드 배경: 왼쪽 위 green-500 → 오른쪽 아래 green-300
const BACKGROUND = {
  experimental_backgroundImage: `linear-gradient(146deg, ${PALETTE.green[500]} 3%, ${PALETTE.green[300]} 93%)`,
};

type ArrivalShareCardProps = {
  readCount: number;
  streakDays: number;
  ref?: Ref<ComponentRef<typeof View>>;
  className?: string;
};

// Figma 3136:37943 — 공유 이미지로 캡처되는 카드라 화면 크기와 상관없이 시안 크기로 고정한다
export function ArrivalShareCard({
  readCount,
  streakDays,
  ref,
  className,
}: ArrivalShareCardProps) {
  return (
    <View
      ref={ref}
      // 캡처 대상 뷰가 네이티브 트리에서 빠지지 않게 한다
      collapsable={false}
      className={cn("h-[468px] w-[353px] overflow-hidden rounded", className)}
      style={BACKGROUND}
    >
      <View
        className="absolute bottom-0 left-0"
        style={{ mixBlendMode: "hard-light" }}
      >
        <ArrivalSubwayIllustration
          width={353}
          height={219}
          preserveAspectRatio="xMidYMid slice"
        />
      </View>
      {/* SVG에 그림자 여백이 포함돼 있어 시안의 곰 중심에 맞춰 놓고 기울인다 */}
      <ArrivalShareBearIllustration
        style={{
          position: "absolute",
          left: 10,
          top: 111,
          transform: [{ rotate: "-11.39deg" }],
        }}
      />
      <Text className="absolute left-6 top-6 text-primary text-display1-b">
        오늘도 해냈다!
      </Text>
      <ArrivalShareIconIllustration
        style={{ position: "absolute", left: 289, top: 24 }}
      />
      <View className="absolute left-6 top-[90px] w-[305px] gap-3.5">
        <View className="flex-row items-center justify-between">
          <Text className="text-secondary text-title3-sb">읽은 기사</Text>
          <Text className="text-secondary text-title3-sb">{readCount}개</Text>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-secondary text-title3-sb">연속 이용</Text>
          <Text className="text-secondary text-title3-sb">
            {streakDays}일째
          </Text>
        </View>
      </View>
    </View>
  );
}
