import * as WebBrowser from "expo-web-browser";
import { type Dispatch, type SetStateAction, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AlarmIcon } from "@/assets/icons";
import { Header } from "@/components/header/header";
import { Tabs } from "@/components/tabs/tabs";
import { ARCHIVE_ARTICLES, ARCHIVE_SMALLTALKS } from "@/mocks/archive";
import { CategoryFilter } from "@/screens/archive/_components/category-filter";
import { EditorPickSmalltalkCard } from "@/screens/archive/_components/editor-pick-smalltalk-card";
import { ScrappedArticleCard } from "@/screens/archive/_components/scrapped-article-card";
import {
  ARCHIVE_CATEGORIES,
  ARCHIVE_TABS,
  type ArchiveTab,
} from "@/screens/archive/_constants";
import { useToastStore } from "@/stores/toast-store";
import type { Category } from "@/theme/category";

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
  const [selectedCategory, setCategory] = useState<Category | "all">("all");
  const [articles, setArticles] = useState(ARCHIVE_ARTICLES);
  const [smalltalks, setSmalltalks] = useState(ARCHIVE_SMALLTALKS);

  const items: { category: Category }[] =
    tab === "article" ? articles : smalltalks;
  const copy = ARCHIVE_TABS[tab];
  const chips = ARCHIVE_CATEGORIES.filter(({ value }) =>
    items.some((item) => item.category === value),
  );
  // 고른 분야의 마지막 항목을 지우면 칩이 사라지므로 '전체'로 보여준다
  const category = chips.some(({ value }) => value === selectedCategory)
    ? selectedCategory
    : "all";
  const isVisible = (item: { category: Category }) =>
    category === "all" || item.category === category;

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
          onChange={(value) => {
            setTab(value as ArchiveTab);
            setCategory("all");
          }}
          className="px-5"
        />
      </View>
      {items.length === 0 ? (
        // TODO: 빈 화면 디자인 확인 중. 지금은 문구만 둔다.
        <View className="flex-1 items-center justify-center px-5">
          <Text className="text-center text-secondary text-body2-m">
            {copy.empty}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerClassName="gap-5 py-5">
          <View className="gap-3.5">
            <Text className="px-5 text-strong text-heading2-sb">
              내가 직접 담은 {items.length}개의 {copy.label}
            </Text>
            <CategoryFilter
              chips={chips}
              value={category}
              onChange={setCategory}
            />
          </View>
          <View className="gap-3.5 px-5">
            {tab === "article"
              ? articles
                  .filter(isVisible)
                  .map((article) => (
                    <ScrappedArticleCard
                      key={article.id}
                      category={article.category}
                      categoryLabel={article.label}
                      title={article.title}
                      image={article.image}
                      aiSummary={article.aiSummary}
                      isBookmarked
                      isDeleted={article.isDeleted}
                      onPress={() => WebBrowser.openBrowserAsync(article.url)}
                      onBookmarkPress={() =>
                        removeWithUndo(articles, setArticles, article)
                      }
                    />
                  ))
              : smalltalks
                  .filter(isVisible)
                  .map((smalltalk) => (
                    <EditorPickSmalltalkCard
                      key={smalltalk.id}
                      category={smalltalk.category}
                      categoryLabel={smalltalk.label}
                      newsTitle={smalltalk.newsTitle}
                      question={smalltalk.question}
                      isBookmarked
                      isDeleted={smalltalk.isDeleted}
                      onPress={() => WebBrowser.openBrowserAsync(smalltalk.url)}
                      onBookmarkPress={() =>
                        removeWithUndo(smalltalks, setSmalltalks, smalltalk)
                      }
                    />
                  ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
