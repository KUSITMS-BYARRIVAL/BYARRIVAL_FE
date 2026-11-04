import { useState } from "react";
import { View } from "react-native";

import { SubwayIcon } from "@/assets/icons";
import { cn } from "@/lib/cn";

const DOT_SIZE = 14;
// 첫·마지막 점이 트랙 끝에서 떨어진 거리 (Figma 13.5~15px)
const DOT_INSET = 14;
const VEHICLE_BOX = 38;

type ProgressStepperProps = {
  /** 전체 단계 수 (Figma: 7단계, 3단계) */
  total: number;
  /** 현재 단계 (1부터) */
  current: number;
  /** 현재 단계 위에 지하철 아이콘을 띄운다 */
  showVehicle?: boolean;
  className?: string;
};

export function ProgressStepper({
  total,
  current,
  showVehicle = false,
  className,
}: ProgressStepperProps) {
  const [width, setWidth] = useState(0);
  const step = Math.min(Math.max(current, 1), total);
  const gap = total > 1 ? (width - DOT_INSET * 2 - DOT_SIZE) / (total - 1) : 0;
  const dotCenter = DOT_INSET + DOT_SIZE / 2 + gap * (step - 1);
  // 채움은 현재 점의 오른쪽 끝까지, 마지막 단계면 트랙 끝까지
  const fillWidth = step === total ? width : dotCenter + DOT_SIZE / 2;

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 1, max: total, now: step }}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      className={cn("h-5 justify-center", className)}
    >
      <View className="h-1 overflow-hidden rounded-full bg-green-100">
        <View
          className="h-full rounded-full bg-green-500"
          style={{ width: fillWidth }}
        />
      </View>
      <View
        className="absolute inset-y-0 flex-row items-center justify-between"
        style={{ left: DOT_INSET, right: DOT_INSET }}
      >
        {Array.from({ length: total }, (_, i) =>
          i < step ? (
            <View
              key={i}
              className="size-3.5 items-center justify-center rounded-full bg-green-500"
            >
              <View className="size-2 rounded-full bg-white" />
            </View>
          ) : (
            <View key={i} className="size-3.5 rounded-full bg-green-100" />
          ),
        )}
      </View>
      {/* 아이콘 박스(38px) 아래쪽이 트랙 위에 닿도록 Figma 위치(top -19) 그대로 둔다 */}
      {showVehicle && width > 0 && (
        <View
          className="absolute items-center justify-center"
          style={{
            top: -19,
            left: dotCenter - VEHICLE_BOX / 2,
            width: VEHICLE_BOX,
            height: VEHICLE_BOX,
          }}
        >
          <SubwayIcon />
        </View>
      )}
    </View>
  );
}
