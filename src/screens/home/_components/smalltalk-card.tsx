import { Pressable, type PressableProps, Text, View } from "react-native";

import { Badge } from "@/components/badge/badge";
import { Bubble } from "@/components/bubble/bubble";
import { cn } from "@/lib/cn";

type SmalltalkCardProps = Omit<PressableProps, "children"> & {
  /** 말을 꺼낼 장소 (예: 엘리베이터에서) */
  place: string;
  question: string;
  followUp: string;
  className?: string;
};

export function SmalltalkCard({
  place,
  question,
  followUp,
  className,
  ...props
}: SmalltalkCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={cn(
        "gap-3.5 overflow-hidden rounded bg-white px-5 pb-4 pt-5",
        className,
      )}
      {...props}
    >
      {({ pressed }) => (
        <>
          <View className="items-start gap-3.5">
            <Badge label={place} color="neutral" />
            <Bubble text={question} className="self-stretch" />
          </View>
          <Text className="pl-2.5 text-secondary text-body3-r">
            <Text className="text-brand text-body3-m">이어서</Text>
            <Text className="text-brand"> · </Text>
            {followUp}
          </Text>
          {pressed && <View className="absolute inset-0 bg-card-pressed-2" />}
        </>
      )}
    </Pressable>
  );
}
