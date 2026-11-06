import { Text, View } from "react-native";

import { TextButton } from "@/components/button/text-button";
import { cn } from "@/lib/cn";
import { SmalltalkCard } from "@/screens/home/_components/smalltalk-card";

type EditorPickSectionProps = {
  smalltalk: { place: string; question: string; followUp: string };
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
        <Text className="text-primary text-title2-sb">
          Editor’s Pick 스몰토크
        </Text>
        <TextButton label="더보기" onPress={onMorePress} />
      </View>
      <SmalltalkCard {...smalltalk} />
    </View>
  );
}
