import { Text, View } from "react-native";

import { cn } from "@/lib/cn";

type BubbleProps = {
  text: string;
  className?: string;
  textClassName?: string;
};

// 현재는 카드 안에서만 쓰여 카드가 누르기를 맡으므로 View로 구현
// 말풍선만 따로 눌러야 하거나 눌림 효과가 필요해지면 Pressable로 바꾼다
export function Bubble({ text, className, textClassName }: BubbleProps) {
  return (
    <View
      className={cn(
        "rounded-xl rounded-tl-none bg-green-100 px-5 py-4",
        className,
      )}
    >
      <Text className={cn("text-primary text-body2-sb", textClassName)}>
        {text}
      </Text>
    </View>
  );
}
