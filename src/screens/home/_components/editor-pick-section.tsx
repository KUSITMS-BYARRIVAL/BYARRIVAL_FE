import { type ComponentProps } from "react";
import { Text, View } from "react-native";

import { TextButton } from "@/components/button/text-button";
import { cn } from "@/lib/cn";
import { EditorPickSmalltalkCard } from "@/screens/_components/editor-pick-smalltalk-card";

type EditorPickSectionProps = {
  smalltalk: Pick<
    ComponentProps<typeof EditorPickSmalltalkCard>,
    "category" | "categoryLabel" | "newsTitle" | "question"
  >;
  onMorePress: () => void;
  className?: string;
};

export function EditorPickSection({
  smalltalk,
  onMorePress,
  className,
}: EditorPickSectionProps) {
  return (
    <View className={cn("gap-3.5", className)}>
      <View className="flex-row items-start justify-between">
        <Text className="text-primary text-title2-sb">스몰토크 추천</Text>
        <TextButton label="더보기" onPress={onMorePress} />
      </View>
      <EditorPickSmalltalkCard {...smalltalk} />
    </View>
  );
}
