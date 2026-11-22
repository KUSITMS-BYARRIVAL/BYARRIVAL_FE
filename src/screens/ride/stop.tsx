import * as Clipboard from "expo-clipboard";
import { router, usePreventRemove } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BookmarkIcon, ShareIcon } from "@/assets/icons";
import { Button } from "@/components/button/button";
import { Header } from "@/components/header/header";
import { LoadingDots } from "@/components/loading-dots/loading-dots";
import { ProgressStepper } from "@/components/progress-stepper/progress-stepper";
import { useReadStop } from "@/hooks/mutations/use-read-stop";
import { useSaveArticle } from "@/hooks/mutations/use-save-article";
import { useUnsaveArticle } from "@/hooks/mutations/use-unsave-article";
import { getStopQuery, useGetStop } from "@/hooks/queries/use-get-stop";
import { useGetTodayRoute } from "@/hooks/queries/use-get-today-route";
import {
  COPY_LINK_TOAST_MESSAGE,
  OPEN_FAIL_TOAST_MESSAGE,
  SCRAP_TOAST_MESSAGE,
} from "@/screens/ride/_constants";
import { StopArticle } from "@/screens/ride/_components/stop-article";
import { findAvailableStop } from "@/screens/ride/_helpers";
import { useDialogStore } from "@/stores/dialog-store";
import { useToastStore } from "@/stores/toast-store";
import { SEMANTIC } from "@/theme/colors";

const showToast = (message: string) =>
  useToastStore.getState().showToast({ message });

// 서버가 준 주소라도 https 원문만 연다. 열지 못하면 false
const openOriginal = async (url: string) => {
  if (!/^https:\/\//i.test(url)) return false;
  try {
    await WebBrowser.openBrowserAsync(url);
    return true;
  } catch {
    return false;
  }
};

export function StopScreen() {
  const { top } = useSafeAreaInsets();
  const { data: today } = useGetTodayRoute();
  const route = today?.route;

  // 이어서 볼 정거장(currentStop)을 처음 한 번만 쓰도록 진행 정보를 받은 뒤에 마운트한다
  return route?.ride ? (
    <StopContent
      routeId={route.routeId}
      totalStops={route.ride.totalStops}
      initialStop={route.ride.currentStop}
    />
  ) : (
    <View className="flex-1 bg-white" style={{ paddingTop: top }}>
      <Header title="정거장" />
      <LoadingDots className="flex-1" />
    </View>
  );
}

type StopContentProps = {
  routeId: number;
  totalStops: number;
  initialStop: number;
};

function StopContent({ routeId, totalStops, initialStop }: StopContentProps) {
  const { top, bottom } = useSafeAreaInsets();
  const [stopNumber, setStopNumber] = useState(initialStop);
  const { data: stop } = useGetStop(routeId, stopNumber);
  const { mutate: readStop } = useReadStop();
  const { mutate: saveArticle, isPending: isSaving } = useSaveArticle();
  const { mutate: unsaveArticle, isPending: isUnsaving } = useUnsaveArticle();
  const openDialog = useDialogStore((state) => state.openDialog);
  const queryClient = useQueryClient();
  const isLast = stopNumber === totalStops;
  const [isMoving, setIsMoving] = useState(false);
  // 멈추기(홈) · 도착으로 나갈 때만 뒤로가기 막기를 푼다
  const [leaveTo, setLeaveTo] = useState<"home" | "arrival" | null>(null);

  const confirmStop = () =>
    openDialog({
      title: "운행을 멈출까요?",
      description: "읽은 기록은 저장돼요",
      confirmLabel: "멈추기",
      onConfirm: () => setLeaveTo("home"),
      cancelLabel: "취소",
      onCancel: () => {},
    });
  // 헤더 뒤로가기 · iOS 스와이프 · Android 뒤로 버튼 모두 확인 다이얼로그를 거친다
  usePreventRemove(leaveTo === null, confirmStop);

  // 막기가 풀린 다음 렌더에서 이동해야 이동 자체가 막히지 않는다
  useEffect(() => {
    if (leaveTo === "home") router.dismissTo("/");
    // 도착하면 운행이 끝나므로 뒤로 가도 정거장으로 돌아오지 않게 바꾼다
    if (leaveTo === "arrival") router.replace("/ride/arrival");
  }, [leaveTo]);

  const findNextStop = useCallback(
    (from: number) =>
      findAvailableStop(from, totalStops, (n) =>
        queryClient.fetchQuery(getStopQuery(routeId, n)),
      ),
    [queryClient, routeId, totalStops],
  );
  // 볼 수 있는 정거장이 남아 있지 않으면 도착
  const moveTo = useCallback(
    (next: number | null) =>
      next === null ? setLeaveTo("arrival") : setStopNumber(next),
    [],
  );

  // 이어서 볼 정거장이 그사이 숨김 · 삭제됐으면 처음부터 건너뛴다 (다음 버튼으로 옮긴 정거장은 항상 볼 수 있다)
  useEffect(() => {
    if (stop?.available !== false) return;
    findNextStop(stopNumber + 1)
      .then(moveTo)
      // 조회 실패는 전역 토스트가 알린다
      .catch(() => {});
  }, [stop?.available, stopNumber, findNextStop, moveTo]);

  const goNext = async () => {
    setIsMoving(true);
    try {
      moveTo(await findNextStop(stopNumber + 1));
    } catch {
      // 조회 실패는 전역 토스트가 알린다. 같은 정거장에 머문다
    } finally {
      setIsMoving(false);
    }
  };

  const handleOriginalPress = async () => {
    if (!stop) return;
    // 원문 열기 성공과 상관없이 누른 순간 완독이다 (다음 버튼이 열린다)
    readStop({ routeId, stopNumber });
    if (!(await openOriginal(stop.sourceUrl)))
      showToast(OPEN_FAIL_TOAST_MESSAGE);
  };

  const handleBookmarkPress = () => {
    if (!stop || isSaving || isUnsaving) return;
    if (stop.scrapped) return unsaveArticle(stop.articleId);
    saveArticle(stop.articleId, {
      onSuccess: () => showToast(SCRAP_TOAST_MESSAGE),
    });
  };

  const handleSharePress = async () => {
    if (!stop) return;
    await Clipboard.setStringAsync(stop.sourceUrl);
    showToast(COPY_LINK_TOAST_MESSAGE);
  };

  const isReady = stop?.available === true;

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: top }}>
      <Header
        title={`${stopNumber}/${totalStops}번째 정거장`}
        onBack={confirmStop}
        right={
          <>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="링크 복사"
              hitSlop={10}
              disabled={!isReady}
              onPress={handleSharePress}
            >
              <ShareIcon color={SEMANTIC.icon["on-fill-muted"]} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="북마크"
              accessibilityState={{ selected: stop?.scrapped ?? false }}
              hitSlop={10}
              disabled={!isReady}
              onPress={handleBookmarkPress}
            >
              {/* shortcut: 저장된 상태용 아이콘이 시안에 없어 색만 바꾼다, 시안 나오면 교체 */}
              <BookmarkIcon
                color={
                  stop?.scrapped
                    ? SEMANTIC.icon.brand
                    : SEMANTIC.icon["on-fill-muted"]
                }
              />
            </Pressable>
          </>
        }
      />
      {/* 정거장이 바뀌면 스크롤을 맨 위로 되돌린다 */}
      <ScrollView key={stopNumber} className="flex-1">
        <View className="px-5 py-7">
          <ProgressStepper total={totalStops} current={stopNumber} />
        </View>
        {isReady ? (
          <View className="px-5">
            <StopArticle stop={stop} onOriginalPress={handleOriginalPress} />
          </View>
        ) : (
          <LoadingDots className="py-20" />
        )}
      </ScrollView>
      <View className="px-5" style={{ paddingBottom: Math.max(bottom, 30) }}>
        <Button
          label={
            isLast
              ? "오늘의 뉴스 완주하기"
              : `다음 정거장 ${stopNumber + 1}/${totalStops}`
          }
          color="brand"
          size="l"
          // 원문 보기를 눌러 완독해야 다음으로 넘어간다
          disabled={!stop?.read || isMoving}
          onPress={goNext}
        />
      </View>
    </View>
  );
}
