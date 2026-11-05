import { cva } from "class-variance-authority";
import { Pressable, type PressableProps, Text, View } from "react-native";

import { cn } from "@/lib/cn";

/**
 * Figma Selection Button 상태
 * - default: 아직 고르지 않음 (Unselected)
 * - correct: 정답 (Correct)
 * - incorrect: 고른 오답 (Answer)
 * - dimmed: 채점 후 나머지 보기 (Wrong)
 */
type QuizOptionState = "default" | "correct" | "incorrect" | "dimmed";

const containerVariants = cva(
  "flex-row items-center gap-2 rounded-md border p-5",
  {
    variants: {
      state: {
        default: "border-transparent bg-white",
        correct: "border-brand bg-card-green",
        incorrect: "border-red bg-card-wrong",
        dimmed: "border-default bg-card-pressed-2",
      },
    },
  },
);

const badgeVariants = cva("size-6 items-center justify-center rounded-full", {
  variants: {
    state: {
      default: "bg-icon-background",
      correct: "bg-green-500",
      incorrect: "bg-red-500",
      dimmed: "bg-icon-background",
    },
  },
});

// 색으로만 보이는 채점 결과를 스크린리더에도 알린다
const STATE_TEXT: Partial<Record<QuizOptionState, string>> = {
  correct: "정답",
  incorrect: "오답",
};

type QuizOptionButtonProps = Omit<PressableProps, "children"> & {
  number: number;
  label: string;
  state?: QuizOptionState;
  className?: string;
};

export function QuizOptionButton({
  number,
  label,
  state = "default",
  className,
  ...props
}: QuizOptionButtonProps) {
  const isMarked = state === "correct" || state === "incorrect";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityValue={
        STATE_TEXT[state] ? { text: STATE_TEXT[state] } : undefined
      }
      className={cn(containerVariants({ state }), className)}
      {...props}
    >
      <View className={badgeVariants({ state })}>
        <Text
          className={cn(
            "text-label2-sb",
            isMarked ? "text-on-fill-default" : "text-secondary",
          )}
        >
          {number}
        </Text>
      </View>
      <Text
        className={cn(
          "flex-1 text-strong",
          isMarked ? "text-body1-sb" : "text-body1-m",
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}
