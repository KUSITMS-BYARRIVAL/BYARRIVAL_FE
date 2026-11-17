import { Pressable, Text, View } from "react-native";

import { CoachArrowLeftIcon, CoachArrowRightIcon } from "@/assets/icons";

type SelectCoachMarkProps = {
  onClose: () => void;
};

/** 뉴스 탑승하기 첫 진입 안내. 화면 전체를 덮고, 누르면 닫힌다 */
export function SelectCoachMark({ onClose }: SelectCoachMarkProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint="눌러서 안내를 닫아요"
      onPress={onClose}
      className="absolute inset-0 flex-row items-center justify-center gap-2 bg-dim"
    >
      <CoachArrowLeftIcon />
      <View className="items-center gap-[18px]">
        <Text className="text-center text-on-fill-default text-heading2-sb">
          {
            "어떤 뉴스가 궁금한가요?\n좌우로 넘기며 읽고 싶은 뉴스를\n골라보세요!"
          }
        </Text>
        <Text className="text-center text-on-fill-default text-body3-m">
          {"읽을 수 있는 시간의 70% 이상을 채우면\n뉴스 읽기가 시작돼요."}
        </Text>
      </View>
      <CoachArrowRightIcon />
    </Pressable>
  );
}
