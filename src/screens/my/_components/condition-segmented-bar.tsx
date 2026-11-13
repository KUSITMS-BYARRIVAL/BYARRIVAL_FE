import { View } from "react-native";

import {
  CONDITION_SEGMENTS,
  type ConditionCounts,
} from "@/screens/my/_constants";

type ConditionSegmentedBarProps = {
  counts: ConditionCounts;
};

export function ConditionSegmentedBar({ counts }: ConditionSegmentedBarProps) {
  return (
    <View className="h-2 flex-row overflow-hidden rounded-full bg-grey-100">
      {CONDITION_SEGMENTS.map(({ key, colorClassName }) => (
        // 일수 비율대로 폭을 나눈다
        <View
          key={key}
          className={colorClassName}
          style={{ flexGrow: counts[key] }}
        />
      ))}
    </View>
  );
}
