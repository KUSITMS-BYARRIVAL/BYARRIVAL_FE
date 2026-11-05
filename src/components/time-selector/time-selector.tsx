import { Pressable, type PressableProps, Text, View } from "react-native";

import { TimeDigitBackgroundIllustration } from "@/assets/illustrations";
import { cn } from "@/lib/cn";

// Figma Time Digit 크기 (가운데 양옆이 파인 숫자판)
const DIGIT_WIDTH = 63.7412;
const DIGIT_HEIGHT = 82.4883;

function TimeDigit({ digit }: { digit: string }) {
  return (
    <View
      className="items-center justify-center"
      style={{ width: DIGIT_WIDTH, height: DIGIT_HEIGHT }}
    >
      <TimeDigitBackgroundIllustration style={{ position: "absolute" }} />
      <Text className="text-primary text-digit-b">{digit}</Text>
    </View>
  );
}

type TimeSelectorProps = Omit<PressableProps, "children"> & {
  /** 0~23 */
  hour: number;
  minute: number;
  className?: string;
};

// 누르면 시간을 고르는 TimePicker 등을 띄우도록 사용처에서 onPress를 넘긴다
export function TimeSelector({
  hour,
  minute,
  className,
  ...props
}: TimeSelectorProps) {
  const [h1, h2] = String(hour).padStart(2, "0");
  const [m1, m2] = String(minute).padStart(2, "0");

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${hour}시 ${minute}분`}
      className={cn(
        "flex-row items-center gap-1.5 overflow-hidden rounded-sm bg-white p-5",
        className,
      )}
      {...props}
    >
      {({ pressed }) => (
        <>
          <TimeDigit digit={h1!} />
          <TimeDigit digit={h2!} />
          <Text className="text-primary text-body2-m">시</Text>
          <TimeDigit digit={m1!} />
          <TimeDigit digit={m2!} />
          <Text className="text-primary text-body2-m">분</Text>
          {pressed && <View className="absolute inset-0 bg-card-pressed-2" />}
        </>
      )}
    </Pressable>
  );
}
