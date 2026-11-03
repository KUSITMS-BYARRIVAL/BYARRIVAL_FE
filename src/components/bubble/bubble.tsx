import { Pressable, type PressableProps, Text, View } from "react-native";

import { cn } from "@/lib/cn";

type BubbleProps = Omit<PressableProps, "children"> & {
  text: string;
  className?: string;
};

export function Bubble({ text, className, ...props }: BubbleProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={cn(
        "overflow-hidden rounded-xl rounded-tl-none bg-green-opacity-100 px-5 py-4",
        className,
      )}
      {...props}
    >
      {({ pressed }) => (
        <>
          {pressed && <View className="absolute inset-0 bg-card-pressed" />}
          <Text className="text-primary text-body2-m">{text}</Text>
        </>
      )}
    </Pressable>
  );
}
