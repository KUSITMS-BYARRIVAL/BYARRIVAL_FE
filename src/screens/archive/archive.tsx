import { type Dispatch, type SetStateAction, useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AlarmIcon } from "@/assets/icons";
import { Header } from "@/components/header/header";
import { Tabs } from "@/components/tabs/tabs";
import { ARCHIVE_ARTICLES, ARCHIVE_SMALLTALKS } from "@/mocks/archive";
import { ArchiveList } from "@/screens/archive/_components/archive-list";
import { ARCHIVE_TABS, type ArchiveTab } from "@/screens/archive/_constants";
import { useToastStore } from "@/stores/toast-store";

function removeWithUndo<T>(
  items: T[],
  setItems: Dispatch<SetStateAction<T[]>>,
  item: T,
) {
  const index = items.indexOf(item);
  setItems((current) => current.filter((i) => i !== item));
  useToastStore.getState().showToast({
    message: "삭제했어요",
    label: "되돌리기",
    onLabelPress: () =>
      setItems((current) => [
        ...current.slice(0, index),
        item,
        ...current.slice(index),
      ]),
  });
}

export function ArchiveScreen() {
  const { top } = useSafeAreaInsets();
  const [tab, setTab] = useState<ArchiveTab>("article");
  const [articles, setArticles] = useState(ARCHIVE_ARTICLES);
  const [smalltalks, setSmalltalks] = useState(ARCHIVE_SMALLTALKS);

  const count = tab === "article" ? articles.length : smalltalks.length;

  return (
    <View className="flex-1 bg-default">
      <View className="bg-white" style={{ paddingTop: top }}>
        {/* TODO: 알림 화면 이동 */}
        <Header title="보관함" right={<AlarmIcon width={24} height={24} />} />
        <Tabs
          items={[
            { value: "article", label: "기사", count: articles.length },
            { value: "smalltalk", label: "스몰토크", count: smalltalks.length },
          ]}
          value={tab}
          onChange={(value) => setTab(value as ArchiveTab)}
          className="px-5"
        />
      </View>
      {count === 0 ? (
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
          onRemoveArticle={(article) =>
            removeWithUndo(articles, setArticles, article)
          }
          onRemoveSmalltalk={(smalltalk) =>
            removeWithUndo(smalltalks, setSmalltalks, smalltalk)
          }
        />
      )}
    </View>
  );
}
