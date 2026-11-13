import { Text, View } from "react-native";

import { ConditionFaceSunnyIllustration } from "@/assets/illustrations";
import { Bubble } from "@/components/bubble/bubble";
import { cn } from "@/lib/cn";
import {
  CONDITION_SEGMENTS,
  type ConditionCounts,
} from "@/screens/my/_constants";

import { ConditionSegmentedBar } from "./condition-segmented-bar";

type ConditionCardProps = {
  counts: ConditionCounts;
  /** [임시] 서버가 내려주는 말풍선 문구 */
  message: string;
};

export function ConditionCard({ counts, message }: ConditionCardProps) {
  return (
    <View className="gap-3 rounded bg-card-white p-5">
      <View className="flex-row items-center justify-between">
        <Text className="text-primary text-title2-sb">컨디션 기록</Text>
        <Text className="text-tertiary text-caption1-m">
          올해 · 완주한 날 기준
        </Text>
      </View>
      <View className="gap-3">
        <View className="flex-row gap-2.5">
          <ConditionFaceSunnyIllustration width={50} height={42.224} />
          {/* 공용 Bubble(green-100·SB)과 달리 이 카드 시안은 green-opacity-100·M이라 덮어쓴다 */}
          <Bubble
            text={message}
            className="flex-1 bg-green-opacity-100"
            textClassName="text-body2-m"
          />
        </View>
        <View className="gap-1.5">
          <ConditionSegmentedBar counts={counts} />
          <View className="flex-row justify-between">
            {CONDITION_SEGMENTS.map(({ key, label, colorClassName }) => (
              <View key={key} className="flex-row items-center gap-1">
                <View className={cn("size-2 rounded-full", colorClassName)} />
                <Text className="text-secondary text-caption1-m">
                  {label} {counts[key]}일
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
