import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";

import { LoadingDots } from "@/components/loading-dots/loading-dots";
import { useGetMe } from "@/hooks/queries/use-get-me";
import { useGetStatsCalendar } from "@/hooks/queries/use-get-stats-calendar";
import { useGetStatsSummary } from "@/hooks/queries/use-get-stats-summary";
import { useGetStatsWeekly } from "@/hooks/queries/use-get-stats-weekly";
import { useCommuteWords } from "@/screens/_hooks/use-commute-words";
import { MySummaryHero } from "@/screens/my/_components/my-summary-hero";
import { WeeklyRecordCard } from "@/screens/my/_components/weekly-record-card";
import { YearStripsCard } from "@/screens/my/_components/year-strips-card";
import { STRIP_LEVEL_BY_API } from "@/screens/my/_constants";

const toHours = (minutes = 0) => Math.floor(minutes / 60);

export function MyScreen() {
  const [viewportHeight, setViewportHeight] = useState(0);
  const today = new Date();
  const year = today.getFullYear();

  const all = useGetStatsSummary("ALL");
  const month = useGetStatsSummary("MONTH");
  const calendar = useGetStatsCalendar(year);
  const weekly = useGetStatsWeekly();
  const { commute } = useCommuteWords();
  // 사진은 받는 동안 기본 아이콘으로 두면 되므로 로딩 대기(queries)에 넣지 않는다
  const me = useGetMe();

  const queries = [all, month, calendar, weekly];
  // 실패는 전역 토스트(query-client)가 알리고, 실패한 영역은 0으로 둔다
  if (queries.some((query) => query.isPending))
    return <LoadingDots className="flex-1 bg-default" />;

  const weeklyMinutes =
    weekly.data?.weeks.map((week) => week.usedMinutes) ?? [];
  const levels = Object.fromEntries(
    (calendar.data?.days ?? []).map((day) => [
      day.date,
      STRIP_LEVEL_BY_API[day.level],
    ]),
  );

  return (
    <ScrollView
      className="flex-1 bg-default"
      onLayout={(e) => setViewportHeight(e.nativeEvent.layout.height)}
    >
      {/* 기기 높이와 상관없이 요약 영역이 첫 화면을 꽉 채운다 */}
      <MySummaryHero
        totalHours={toHours(all.data?.usedMinutes)}
        monthMinutes={month.data?.usedMinutes ?? 0}
        readCount={month.data?.readArticleCount ?? 0}
        commute={commute}
        profileImageUrl={me.data?.profileImageUrl ?? null}
        onPressProfile={() => router.push("/profile")}
        minHeight={viewportHeight}
      />
      <View className="gap-3.5 px-5 pb-[30px] pt-5">
        <YearStripsCard
          levels={levels}
          today={today}
          completedDays={calendar.data?.completedDays ?? 0}
        />
        {/* 컨디션 기록 카드(ConditionCard)는 기획 확정 후 이 자리에 추가 */}
        <WeeklyRecordCard weeklyMinutes={weeklyMinutes} />
      </View>
    </ScrollView>
  );
}
