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
  onSmalltalkPress: () => void;
  className?: string;
};

export function EditorPickSection({
  smalltalk,
  onMorePress,
  onSmalltalkPress,
  className,
}: EditorPickSectionProps) {
  return (
    <View className={cn("gap-3.5", className)}>
      <View className="flex-row items-start justify-between">
        <Text className="text-primary text-title2-sb">스몰토크 추천</Text>
        <TextButton label="더보기" onPress={onMorePress} />
      </View>
      {/* TODO: 홈 API 연동 때 북마크 연결 — 스몰토크 화면처럼 useSaveSmalltalk · useUnsaveSmalltalk로 담기/빼기 */}
      <EditorPickSmalltalkCard {...smalltalk} onPress={onSmalltalkPress} />
    </View>
  );
}
