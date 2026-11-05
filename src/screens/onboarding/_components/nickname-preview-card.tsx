import { Text, View } from "react-native";

import { BearMagnifierIllustration } from "@/assets/illustrations";
import { cn } from "@/lib/cn";

type NicknamePreviewCardProps = {
  nickname: string;
  className?: string;
};

export function NicknamePreviewCard({
  nickname,
  className,
}: NicknamePreviewCardProps) {
  return (
    <View
      className={cn(
        "items-center overflow-hidden rounded bg-white pt-5",
        className,
      )}
    >
      <BearMagnifierIllustration />
      <View className="w-full items-center gap-2.5 px-5 pb-5">
        <Text className="text-center text-tertiary text-caption1-r">
          앱에서 이렇게 보여요
        </Text>
        <View className="items-center gap-2">
          <Text className="text-center text-primary text-title1-sb">
            {nickname}님,
          </Text>
          <Text className="text-center text-secondary text-body2-m">
            오늘 출근길도 화이팅!
          </Text>
        </View>
      </View>
    </View>
  );
}
