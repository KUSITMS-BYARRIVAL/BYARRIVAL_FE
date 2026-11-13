import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";

import { ARCHIVE_ARTICLES } from "@/mocks/archive";
import {
  LAST_WEEK_DIFF_MINUTES,
  MONTH_MINUTES,
  MONTH_READ_COUNT,
  RECORD_SUMMARY,
  STRIP_LEVELS,
  TOTAL_HOURS,
  WEEKLY_MINUTES,
} from "@/mocks/my";
import { MySummaryHero } from "@/screens/my/_components/my-summary-hero";
import { RecordSummaryCard } from "@/screens/my/_components/record-summary-card";
import { RecentSavedArticlesCard } from "@/screens/my/_components/recent-saved-articles-card";
import { WeeklyRecordCard } from "@/screens/my/_components/weekly-record-card";
import { YearStripsCard } from "@/screens/my/_components/year-strips-card";

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
        <RecordSummaryCard {...RECORD_SUMMARY} />
        <YearStripsCard levels={STRIP_LEVELS} today={new Date()} />
        {/* 컨디션 기록 카드(ConditionCard)는 기획 확정 후 이 자리에 추가 */}
        <WeeklyRecordCard
          weeklyMinutes={WEEKLY_MINUTES}
          lastWeekDiff={LAST_WEEK_DIFF_MINUTES}
        />
        <RecentSavedArticlesCard
          articles={ARCHIVE_ARTICLES.slice(0, 3)}
          onPressMore={() =>
            router.navigate({
              pathname: "/archive",
              params: { tab: "article" },
            })
          }
        />
      </View>
    </ScrollView>
  );
}
