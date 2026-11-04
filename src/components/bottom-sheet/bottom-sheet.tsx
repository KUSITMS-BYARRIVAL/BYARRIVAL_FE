import type { ReactNode } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/button/button";

type BottomSheetProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  buttonLabel: string;
  onButtonPress: () => void;
  /** OptionList · TimePicker 등 본문 */
  children: ReactNode;
};

export function BottomSheet({
  visible,
  title,
  onClose,
  buttonLabel,
  onButtonPress,
  children,
}: BottomSheetProps) {
  const { bottom } = useSafeAreaInsets();

  // TODO: 아래에서 올라오는 애니메이션과 손잡이 드래그로 닫기는 후속 작업
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        {/* TODO: 딤 색은 Figma에 없어 Dialog와 같은 임시 값. 디자인 확정 후 토큰으로 교체 */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="배경 닫기"
          className="absolute inset-0 bg-grey-opacity-500"
          onPress={onClose}
        />
        {/* 스크린리더는 딤에 닿지 않으므로 iOS 이스케이프 제스처와 손잡이 닫기 버튼으로 닫는다 */}
        <View
          accessibilityViewIsModal
          onAccessibilityEscape={onClose}
          className="max-h-[90%] rounded-t-xl bg-white"
          style={{ paddingBottom: bottom }}
        >
          {/* 손잡이 #D9D9D9는 토큰에 없어 가장 가까운 grey-300을 쓴다. 모양은 그대로 두고 눌러서 닫을 수 있게 한다 */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="닫기"
            hitSlop={8}
            className="items-center pt-4"
            onPress={onClose}
          >
            <View className="h-1 w-10 rounded-[2px] bg-grey-300" />
          </Pressable>
          {/* Figma 제목 #111은 토큰에 없어 text-strong(#1B1B1B)을 쓴다 */}
          <Text
            accessibilityRole="header"
            className="px-5 pb-3 pt-5 text-strong text-title1-sb"
          >
            {title}
          </Text>
          {/* 본문이 길면 제목·버튼은 고정하고 본문만 스크롤한다 */}
          <ScrollView
            className="shrink"
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
          <View className="items-center px-5 pb-5 pt-5">
            <Button
              label={buttonLabel}
              color="neutral"
              className="w-[273px]"
              onPress={onButtonPress}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
