import { type ComponentRef, useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Text,
  View,
} from "react-native";

import { cn } from "@/lib/cn";

const fadeImage = require("@/assets/images/time-picker-fade.png");

const ITEM_HEIGHT = 42;
const PICKER_HEIGHT = 161;
// 선택 칸이 가운데 오도록 첫·마지막 항목 바깥에 여백을 둔다
const EDGE_PADDING = (PICKER_HEIGHT - ITEM_HEIGHT) / 2;

const MINUTE_STEP = 5;
const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const MINUTES = Array.from({ length: 60 / MINUTE_STEP }, (_, i) =>
  String(i * MINUTE_STEP).padStart(2, "0"),
);
const PERIODS = ["오전", "오후"];

/** 24시간제 시각. minute은 MINUTE_STEP 단위로 맞춘다 */
export type Time = { hour: number; minute: number };

const clamp = (n: number, max: number) => Math.min(Math.max(n, 0), max);

function toIndexes({ hour, minute }: Time) {
  return {
    hour: (hour % 12 || 12) - 1,
    minute: clamp(Math.round(minute / MINUTE_STEP), MINUTES.length - 1),
    period: hour < 12 ? 0 : 1,
  };
}

function toTime(hour: number, minute: number, period: number): Time {
  return {
    hour: ((hour + 1) % 12) + period * 12,
    minute: minute * MINUTE_STEP,
  };
}

type Align = "left" | "center" | "right";

const ALIGN_CLASS: Record<Align, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

// Figma 휠처럼 가운데서 멀어질수록 작아지고, 두 칸 밖은 납작하게 눌려 가운데로 붙는다
const DISTANCE = [-2, -1, 0, 1, 2];
const SCALE_X = [0.6, 0.73, 1, 0.73, 0.6];
const SCALE_Y = [0.2, 0.73, 1, 0.73, 0.2];
const SHIFT_Y = [-22, 0, 0, 0, 22];

type WheelColumnProps = {
  items: string[];
  index: number;
  onChange: (index: number) => void;
  label: string;
  align: Align;
  className?: string;
};

function WheelColumn({
  items,
  index,
  onChange,
  label,
  align,
  className,
}: WheelColumnProps) {
  const scrollRef = useRef<ComponentRef<typeof Animated.ScrollView>>(null);
  const [scrollY] = useState(() => new Animated.Value(index * ITEM_HEIGHT));

  // contentOffset 초기값은 iOS만 지원해 Android도 맞도록 직접 스크롤한다
  useEffect(() => {
    scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: false });
  }, [index]);

  const changeTo = (next: number) => {
    const clamped = clamp(next, items.length - 1);
    if (clamped !== index) onChange(clamped);
  };
  // 코드로 스크롤을 맞출 때도 스크롤 끝 이벤트가 와서 값이 바뀌지 않게, 사용자가 끌었을 때만 확정한다
  const draggingRef = useRef(false);
  const settle = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!draggingRef.current) return;
    changeTo(Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT));
  };

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ text: items[index] }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={(e) =>
        changeTo(index + (e.nativeEvent.actionName === "increment" ? 1 : -1))
      }
      className={className}
    >
      <Animated.ScrollView
        ref={scrollRef}
        style={{ height: PICKER_HEIGHT }}
        contentContainerStyle={{ paddingVertical: EDGE_PADDING }}
        showsVerticalScrollIndicator={false}
        // Android는 세로 스크롤 안의 세로 스크롤이 기본으로 바깥에 드래그를 뺏기므로
        // (예: BottomSheet 본문 ScrollView 안) 휠이 직접 스크롤을 받도록 켠다
        nestedScrollEnabled
        // iOS가 상단바만큼 스크롤 여백을 자동으로 더하면 칸 위치가 어긋나 끈다
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        // 관성 없이 손을 떼면 Android는 momentum 이벤트가 없어 drag 끝에서도 확정한다
        onScrollBeginDrag={() => (draggingRef.current = true)}
        onScrollEndDrag={settle}
        onMomentumScrollEnd={(e) => {
          settle(e);
          draggingRef.current = false;
        }}
      >
        {items.map((item, i) => {
          const distance = Animated.divide(
            Animated.subtract(scrollY, i * ITEM_HEIGHT),
            ITEM_HEIGHT,
          );
          const at = (outputRange: number[]) =>
            distance.interpolate({
              inputRange: DISTANCE,
              outputRange,
              extrapolate: "clamp",
            });
          return (
            <Animated.View
              key={item}
              className="justify-center"
              style={{
                height: ITEM_HEIGHT,
                transformOrigin: align,
                transform: [
                  { translateY: at(SHIFT_Y) },
                  { scaleX: at(SCALE_X) },
                  { scaleY: at(SCALE_Y) },
                ],
              }}
            >
              <Text
                className={cn(
                  "text-heading2-sb",
                  ALIGN_CLASS[align],
                  i === index ? "text-primary" : "text-tertiary",
                )}
              >
                {item}
              </Text>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}

type TimePickerProps = {
  value: Time;
  onChange: (value: Time) => void;
  className?: string;
};

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  const { hour, minute, period } = toIndexes(value);

  // 열 위치·너비는 Figma(358px) 수치에 맞춘 값이다
  return (
    <View
      className={cn("w-[358px] flex-row self-center", className)}
      style={{ height: PICKER_HEIGHT }}
    >
      <View
        className="absolute inset-x-0 h-[42px] rounded-sm bg-green-50"
        style={{ top: EDGE_PADDING }}
      />
      <WheelColumn
        items={HOURS}
        index={hour}
        onChange={(h) => onChange(toTime(h, minute, period))}
        label="시"
        align="right"
        className="ml-[76px] w-10"
      />
      <View className="w-[34px] justify-center pl-5">
        <Text className="text-primary text-heading2-sb">:</Text>
      </View>
      <WheelColumn
        items={MINUTES}
        index={minute}
        onChange={(m) => onChange(toTime(hour, m, period))}
        label="분"
        align="center"
        className="w-11"
      />
      <WheelColumn
        items={PERIODS}
        index={period}
        onChange={(p) => onChange(toTime(hour, minute, p))}
        label="오전 오후"
        align="left"
        className="ml-5 w-[50px]"
      />
      <Image
        source={fadeImage}
        pointerEvents="none"
        className="absolute left-0 top-0 h-[25px] w-[358px]"
      />
      <Image
        source={fadeImage}
        pointerEvents="none"
        className="absolute bottom-0 left-0 h-[25px] w-[358px]"
        style={{ transform: [{ scaleY: -1 }] }}
      />
    </View>
  );
}
