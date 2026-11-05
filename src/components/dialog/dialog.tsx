import { Modal, Text, View } from "react-native";

import { Button } from "@/components/button/button";
import { cn } from "@/lib/cn";

type DialogProps = {
  visible: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  confirmColor?: "brand" | "neutral" | "danger";
  onConfirm: () => void;
  cancelLabel?: string;
  /** 넘기면 취소 버튼이 생겨 버튼 2개가 된다 */
  onCancel?: () => void;
};

// Figma 그림자(0 0 10 black 5%)에 맞는 토큰이 없어 값으로 지정한다
const CARD_SHADOW = { boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.05)" };

export function Dialog({
  visible,
  title,
  description,
  confirmLabel = "확인",
  confirmColor = "brand",
  onConfirm,
  cancelLabel = "취소",
  onCancel,
}: DialogProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      // Android 뒤로가기는 취소로, 버튼이 하나면 확인으로 닫는다
      onRequestClose={onCancel ?? onConfirm}
    >
      {/* TODO: 딤 색은 Figma에 없어 임시 값. 디자인 확정 후 토큰으로 교체 */}
      <View className="flex-1 items-center justify-center bg-grey-opacity-500">
        <View
          accessibilityViewIsModal
          className="w-[313px] items-center rounded bg-white"
          style={CARD_SHADOW}
        >
          <View className="w-full gap-2 px-5 pt-5">
            <Text
              accessibilityRole="header"
              className="text-center text-primary text-title1-sb"
            >
              {title}
            </Text>
            {description && (
              <Text className="text-center text-grey-500 text-body2-r">
                {description}
              </Text>
            )}
          </View>
          <View
            className={cn(
              "w-full",
              onCancel ? "flex-row gap-2 px-5 py-4" : "p-5",
            )}
          >
            {onCancel && (
              <Button
                label={cancelLabel}
                color="neutral-weak"
                className="flex-1"
                onPress={onCancel}
              />
            )}
            <Button
              label={confirmLabel}
              color={confirmColor}
              className={onCancel ? "flex-1" : undefined}
              onPress={onConfirm}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
