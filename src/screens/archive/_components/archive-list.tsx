import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { track } from "@/lib/analytics";
import { CATEGORY_IMAGES, CATEGORY_KEY_BY_ID } from "@/screens/_constants";
import { EditorPickSmalltalkCard } from "@/screens/_components/editor-pick-smalltalk-card";
import { CategoryFilter } from "@/screens/archive/_components/category-filter";
import { ScrappedArticleCard } from "@/screens/archive/_components/scrapped-article-card";
import { ARCHIVE_TABS, type ArchiveTab } from "@/screens/archive/_constants";
import type {
  Library,
  LibraryArticle,
  LibrarySmalltalk,
} from "@/types/scrap/scrap.types";

type ArchiveListProps = {
  tab: ArchiveTab;
  /** 보여줄 항목 (지운 항목은 이미 빠져 있다) */
  articles: LibraryArticle[];
  smalltalks: LibrarySmalltalk[];
  categories: Library["categories"];
  onRemove: (scrapId: number) => void;
};

// 서버가 준 주소라도 https 원문만 연다
const openSource = (url: string) => {
  if (url.startsWith("https://")) WebBrowser.openBrowserAsync(url);
};

export function ArchiveList({
  tab,
  articles,
  smalltalks,
  categories,
  onRemove,
}: ArchiveListProps) {
  const [selected, setSelected] = useState<number | "all">("all");

  const items: { categoryId: number }[] =
    tab === "article" ? articles : smalltalks;
  // 지운 항목 때문에 비게 된 카테고리 칩은 숨기고, 고른 칩이 사라지면 '전체'로 보여준다
  const chips = categories.filter((category) =>
    items.some((item) => item.categoryId === category.categoryId),
  );
  const category = chips.some((chip) => chip.categoryId === selected)
    ? selected
    : "all";
  const isVisible = (item: { categoryId: number }) =>
    category === "all" || item.categoryId === category;

  return (
    // shortcut: ScrollView + map. 담은 항목이 수백 개로 늘면 FlatList로 바꿀 것
    <ScrollView contentContainerClassName="gap-5 py-5">
      <View className="gap-3.5">
        <Text className="px-5 text-strong text-heading2-sb">
          스크랩한 {items.length}개의 {ARCHIVE_TABS[tab].label}
        </Text>
        <CategoryFilter chips={chips} value={category} onChange={setSelected} />
      </View>
      <View className="gap-3.5 px-5">
        {tab === "article"
          ? articles.filter(isVisible).map((article) => (
              <ScrappedArticleCard
                key={article.scrapId}
                category={CATEGORY_KEY_BY_ID[article.categoryId]}
                categoryLabel={article.categoryName}
                title={article.title}
                // scrapId로 고르면 다시 그려도 같은 카드는 같은 이미지가 나온다
                image={CATEGORY_IMAGES[article.categoryId][article.scrapId % 5]}
                aiSummary={article.oneLine}
                isBookmarked
                isDeleted={!article.available}
                onPress={() => {
                  track("saved_item_open", {
                    tab: "article",
                    article_id: article.articleId,
                  });
                  openSource(article.sourceUrl);
                }}
                onBookmarkPress={() => onRemove(article.scrapId)}
              />
            ))
          : smalltalks.filter(isVisible).map((smalltalk) => (
              <EditorPickSmalltalkCard
                key={smalltalk.scrapId}
                category={CATEGORY_KEY_BY_ID[smalltalk.categoryId]}
                categoryLabel={smalltalk.categoryName}
                newsTitle={smalltalk.articleTitle}
                question={smalltalk.hook}
                isBookmarked
                isDeleted={!smalltalk.available}
                onPress={() => {
                  track("saved_item_open", {
                    tab: "smalltalk",
                    talk_id: smalltalk.smalltalkId,
                  });
                  openSource(smalltalk.sourceUrl);
                }}
                onBookmarkPress={() => onRemove(smalltalk.scrapId)}
              />
            ))}
      </View>
    </ScrollView>
  );
}
