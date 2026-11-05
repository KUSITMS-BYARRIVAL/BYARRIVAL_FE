import { Text, View } from "react-native";

import { cn } from "@/lib/cn";

export type CalendarDayStatus = "before" | "attendance" | "complete" | "offday";

type CalendarDayProps = {
  day: number;
  status?: CalendarDayStatus;
  isToday?: boolean;
};

const STATUS_CLASS: Record<
  CalendarDayStatus,
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

export function CalendarDay({
  day,
  status = "before",
  isToday = false,
}: CalendarDayProps) {
  const { box, text, todayBorder } = STATUS_CLASS[status];

  return (
    <View
      className={cn(
        "size-[38px] items-center justify-center rounded-sm",
        box,
        isToday && `border-2 ${todayBorder}`,
      )}
    >
      <Text className={cn("text-body2-m", text)}>{day}</Text>
    </View>
  );
}
