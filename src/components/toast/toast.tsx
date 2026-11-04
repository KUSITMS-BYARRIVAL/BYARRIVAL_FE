import { Pressable, Text, View } from "react-native";

import { cn } from "@/lib/cn";

type ToastProps = {
  message: string;
  label?: string;
  onLabelPress?: () => void;
  className?: string;
};

export function Toast({ message, label, onLabelPress, className }: ToastProps) {
  return (
    <View
      accessibilityLiveRegion="polite"
      className={cn(
        "h-12 flex-row items-center justify-between rounded-md bg-grey-opacity-700",
        label ? "pl-[18px]" : "px-[18px]",
        className,
      )}
    >
      <Text className="text-on-fill-default text-label2-sb">{message}</Text>
      {label && (
        <Pressable
          accessibilityRole="button"
          onPress={onLabelPress}
          className="px-[18px] py-[13.5px]"
        >
          <Text className="text-green-500 text-label2-sb">{label}</Text>
        </Pressable>
      )}
    </View>
  );
}
