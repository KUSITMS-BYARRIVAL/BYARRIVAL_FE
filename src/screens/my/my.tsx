import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";

import {
  DAY_STATUSES_BY_MONTH,
  LAST_WEEK_DIFF_MINUTES,
  MONTH_MINUTES,
  MONTH_READ_COUNT,
  MONTH_STATUSES_BY_YEAR,
  TOTAL_HOURS,
  WEEKLY_MINUTES,
} from "@/mocks/stats";
import { MySummaryHero } from "@/screens/my/_components/my-summary-hero";
import { RecordCalendar } from "@/screens/my/_components/record-calendar";
import { WeeklyRecordCard } from "@/screens/my/_components/weekly-record-card";

export function MyScreen() {
  const [viewportHeight, setViewportHeight] = useState(0);

  return (
    <ScrollView
      className="flex-1 bg-default"
      onLayout={(e) => setViewportHeight(e.nativeEvent.layout.height)}
    >
      {/* 기기 높이와 상관없이 요약 영역이 첫 화면을 꽉 채운다 */}
      <MySummaryHero
        totalHours={TOTAL_HOURS}
        monthMinutes={MONTH_MINUTES}
        readCount={MONTH_READ_COUNT}
        onPressProfile={() => router.push("/profile")}
        minHeight={viewportHeight}
      />
      <View className="gap-3.5 px-5 pb-[30px] pt-5">
        <RecordCalendar
          dayStatusesByMonth={DAY_STATUSES_BY_MONTH}
          monthStatusesByYear={MONTH_STATUSES_BY_YEAR}
        />
        <WeeklyRecordCard
          weeklyMinutes={WEEKLY_MINUTES}
          lastWeekDiff={LAST_WEEK_DIFF_MINUTES}
        />
      </View>
    </ScrollView>
  );
}
