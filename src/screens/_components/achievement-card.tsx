import { Text, View } from "react-native";

import { BearCelebrateIllustration } from "@/assets/illustrations";
import { cn } from "@/lib/cn";

// 일러스트 SVG는 바깥 여백(Figma 기준 좌우 43.59%, 상하 34.62%)을 포함해 곰보다 크다.
// 레이아웃은 곰 크기 박스로 잡고, SVG는 여백만큼 박스 밖으로 겹쳐 그린다
const BLEED_X = 0.4359;
const BLEED_Y = 0.3462;
const BEAR_RATIO = 89.406 / 71;

const BEAR_WIDTH = { horizontal: 71, vertical: 74 };

function Bear({ width }: { width: number }) {
  const height = width * BEAR_RATIO;
  return (
    <View style={{ width, height }}>
      <BearCelebrateIllustration
        width={width * (1 + BLEED_X * 2)}
        height={height * (1 + BLEED_Y * 2)}
        style={{
          position: "absolute",
          left: -width * BLEED_X,
          top: -height * BLEED_Y,
        }}
      />
    </View>
  );
}

type AchievementCardProps = {
  title: string;
  description: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
};

export function AchievementCard({
  title,
  description,
  orientation = "horizontal",
  className,
}: AchievementCardProps) {
  const horizontal = orientation === "horizontal";

  return (
    <View
      className={cn(
        "gap-2 rounded bg-white p-5",
        horizontal
          ? "flex-row items-center justify-end"
          : "h-[192px] items-center",
        className,
      )}
    >
      <Bear width={BEAR_WIDTH[orientation]} />
      <View
        className={cn(
          "gap-2",
          horizontal ? "flex-1 items-end" : "items-center",
        )}
      >
        <Text className="text-primary text-title2-sb">{title}</Text>
        <Text
          className={cn(
            "text-brand text-body2-m",
            horizontal ? "text-right" : "text-center",
          )}
        >
          {description}
        </Text>
      </View>
    </View>
  );
}
