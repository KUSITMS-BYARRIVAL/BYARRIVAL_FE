import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AlarmButton } from "@/screens/_components/alarm-button";
import { Header } from "@/components/header/header";
import { LoadingDots } from "@/components/loading-dots/loading-dots";
import { Tabs } from "@/components/tabs/tabs";
import { useDeleteScrap } from "@/hooks/mutations/use-delete-scrap";
import { useRestoreScrap } from "@/hooks/mutations/use-restore-scrap";
import { useGetScrapLibrary } from "@/hooks/queries/use-get-scrap-library";
import { ArchiveList } from "@/screens/archive/_components/archive-list";
import { ARCHIVE_TABS, type ArchiveTab } from "@/screens/archive/_constants";
import { useToastStore } from "@/stores/toast-store";

export function ArchiveScreen() {
  const { top } = useSafeAreaInsets();
  // 다른 화면에서 특정 탭으로 열 수 있도록 탭을 URL 파라미터로 둔다 (예: 마이홈 전체보기 → 기사)
  const params = useLocalSearchParams<{ tab?: string }>();
  const tab: ArchiveTab = params.tab === "smalltalk" ? "smalltalk" : "article";
  const otherTab: ArchiveTab = tab === "article" ? "smalltalk" : "article";
  const library = useGetScrapLibrary({
    type: ARCHIVE_TABS[tab].type,
    sort: "LATEST",
  });
  const deleteScrap = useDeleteScrap();
  const restoreScrap = useRestoreScrap();
  // 지운 항목을 서버 응답을 기다리지 않고 바로 숨긴다. 캐시에는 남아 있어 [되돌리기] 때 원래 자리로 바로 돌아온다
  const [hiddenIds, setHiddenIds] = useState<number[]>([]);

  const unhide = (scrapId: number) =>
    setHiddenIds((ids) => ids.filter((id) => id !== scrapId));

  const handleRemove = (scrapId: number) => {
    setHiddenIds((ids) => [...ids, scrapId]);
    // 실패하면 다시 보여준다 (실패 토스트는 전역 처리)
    const isDeleted = deleteScrap.mutateAsync(scrapId).then(
      () => true,
      () => {
        unhide(scrapId);
        return false;
      },
    );
    useToastStore.getState().showToast({
      message: "삭제했어요",
      label: "되돌리기",
      onLabelPress: () => {
        unhide(scrapId);
        // 삭제가 서버에 반영된 뒤에 되살려야 순서가 꼬이지 않는다
        isDeleted.then((ok) => ok && restoreScrap.mutate(scrapId));
      },
    });
  };

  const isVisible = (item: { scrapId: number }) =>
    !hiddenIds.includes(item.scrapId);
  const articles = (library.data?.articles ?? []).filter(isVisible);
  const smalltalks = (library.data?.smalltalks ?? []).filter(isVisible);
  const count = tab === "article" ? articles.length : smalltalks.length;
  const counts = {
    [tab]: count,
    [otherTab]: library.data?.counts[otherTab],
  };

  return (
    <View className="flex-1 bg-default">
      <View className="bg-white" style={{ paddingTop: top }}>
        <Header title="보관함" right={<AlarmButton />} />
        <Tabs
          items={[
            { value: "article", label: "기사", count: counts.article },
            { value: "smalltalk", label: "스몰토크", count: counts.smalltalk },
          ]}
          value={tab}
          onChange={(value) => router.setParams({ tab: value })}
          className="px-5"
        />
      </View>
      {/* 조회 실패는 전역 토스트가 알리고, 빈 탭으로 보여준다 */}
      {library.isPending ? (
        <LoadingDots className="flex-1" />
      ) : count === 0 ? (
        // TODO: 빈 화면 디자인 확인 중. 지금은 문구만 둔다.
        <View className="flex-1 items-center justify-center px-5">
          <Text className="text-center text-secondary text-body2-m">
            {ARCHIVE_TABS[tab].empty}
          </Text>
        </View>
      ) : (
        <ArchiveList
          // 탭을 바꾸면 카테고리 선택을 '전체'로 되돌리려고 새로 마운트한다
          key={tab}
          tab={tab}
          articles={articles}
          smalltalks={smalltalks}
          categories={library.data?.categories ?? []}
          onRemove={handleRemove}
        />
      )}
    </View>
  );
}
