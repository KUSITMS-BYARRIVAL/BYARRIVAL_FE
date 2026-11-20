import { Modal, Pressable, Text, View } from "react-native";

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
  /** 넘기면 바깥(딤)을 눌러 아무것도 고르지 않고 닫을 수 있다 */
  onDismiss?: () => void;
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
  onDismiss,
}: DialogProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      // Android 뒤로가기는 취소로, 버튼이 하나면 확인으로 닫는다
      onRequestClose={onCancel ?? onConfirm}
    >
      <View className="flex-1 items-center justify-center bg-dim">
        {/* 카드보다 먼저 깔아 카드 안을 누를 때는 닫히지 않게 한다 */}
        {onDismiss && (
          <Pressable
            accessibilityLabel="닫기"
            className="absolute inset-0"
            onPress={onDismiss}
          />
        )}
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
