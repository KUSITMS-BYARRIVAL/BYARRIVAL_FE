import { Text, View } from "react-native";

import { cn } from "@/lib/cn";

export type CalendarStatus = "before" | "attendance" | "complete" | "offday";

type CalendarCellProps = {
  label: string;
  status?: CalendarStatus;
  isToday?: boolean;
  /** 칸 크기는 사용처가 정한다 (일: 38×38, 월: 45.5×48) */
  className?: string;
};

const STATUS_CLASS: Record<
  CalendarStatus,
  { box: string; text: string; todayBorder: string }
> = {
  before: { box: "", text: "text-secondary", todayBorder: "border-green-500" },
  attendance: {
    box: "bg-green-300",
    text: "text-on-fill-default",
    todayBorder: "border-green-600",
  },
  complete: {
    box: "bg-green-500",
    text: "text-on-fill-default",
    todayBorder: "border-green-700",
  },
  offday: {
    box: "bg-icon-background",
    text: "text-secondary",
    todayBorder: "border-green-500",
  },
};

const STATUS_NAME: Record<CalendarStatus, string> = {
  before: "",
  attendance: "출석",
  complete: "완주",
  offday: "쉬는 날",
};

export function CalendarCell({
  label,
  status = "before",
  isToday = false,
  className,
}: CalendarCellProps) {
  const { box, text, todayBorder } = STATUS_CLASS[status];

  return (
    <View
      accessible
      accessibilityLabel={[label, STATUS_NAME[status], isToday && "현재"]
        .filter(Boolean)
        .join(", ")}
      className={cn(
        "items-center justify-center rounded-sm",
        box,
        isToday && `border-2 ${todayBorder}`,
        className,
      )}
    >
      <Text className={cn("text-body2-m", text)}>{label}</Text>
    </View>
  );
}
