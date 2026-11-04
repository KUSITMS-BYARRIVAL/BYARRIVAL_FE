import type { ReactNode } from "react";
import { Modal, Pressable, Text, View } from "react-native";
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
          accessibilityLabel="닫기"
          className="absolute inset-0 bg-grey-opacity-500"
          onPress={onClose}
        />
        {/* 스크린리더는 딤에 닿지 않으므로 iOS 이스케이프 제스처로 닫는다 */}
        <View
          accessibilityViewIsModal
          onAccessibilityEscape={onClose}
          className="rounded-t-xl bg-white"
          style={{ paddingBottom: bottom }}
        >
          {/* 손잡이 #D9D9D9는 토큰에 없어 가장 가까운 grey-300을 쓴다 */}
          <View className="items-center pt-4">
            <View className="h-1 w-10 rounded-[2px] bg-grey-300" />
          </View>
          {/* Figma 제목 #111은 토큰에 없어 text-strong(#1B1B1B)을 쓴다 */}
          <Text
            accessibilityRole="header"
            className="px-5 pb-3 pt-5 text-strong text-title1-sb"
          >
            {title}
          </Text>
          <View className="gap-5">
            {children}
            <View className="items-center px-5 pb-5">
              <Button
                label={buttonLabel}
                color="neutral"
                className="w-[273px]"
                onPress={onButtonPress}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
