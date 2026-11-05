import { Text, View } from "react-native";

import { cn } from "@/lib/cn";

type SummaryCardProps = {
  points: string[];
  className?: string;
};

export function SummaryCard({ points, className }: SummaryCardProps) {
  return (
    <View
      className={cn(
        "gap-[15px] rounded-md border border-brand bg-card-green p-5",
        className,
      )}
    >
      <Text className="text-primary text-label2-sb">AI가 요약한 핵심 내용</Text>
      <View className="gap-2">
        {points.map((point, i) => (
          <View key={i} className="flex-row items-start gap-2">
            {/* Figma 번호 원은 1~3만 그림으로 있어 개수와 상관없이 쓰도록 원과 숫자로 그린다 */}
            <View className="size-6 items-center justify-center rounded-full bg-green-500">
              <Text className="text-on-fill-default text-label2-sb">
                {i + 1}
              </Text>
            </View>
            <Text className="flex-1 text-secondary text-body2-m">{point}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
