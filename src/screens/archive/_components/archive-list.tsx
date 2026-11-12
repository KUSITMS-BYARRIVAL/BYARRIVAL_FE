import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import type { ARCHIVE_ARTICLES, ARCHIVE_SMALLTALKS } from "@/mocks/archive";
import { CategoryFilter } from "@/screens/archive/_components/category-filter";
import { EditorPickSmalltalkCard } from "@/screens/archive/_components/editor-pick-smalltalk-card";
import { ScrappedArticleCard } from "@/screens/archive/_components/scrapped-article-card";
import {
  ARCHIVE_CATEGORIES,
  ARCHIVE_TABS,
  type ArchiveTab,
} from "@/screens/archive/_constants";
import type { Category } from "@/theme/category";

type ArchiveArticle = (typeof ARCHIVE_ARTICLES)[number];
type ArchiveSmalltalk = (typeof ARCHIVE_SMALLTALKS)[number];

type ArchiveListProps = {
  tab: ArchiveTab;
  articles: ArchiveArticle[];
  smalltalks: ArchiveSmalltalk[];
  onRemoveArticle: (article: ArchiveArticle) => void;
  onRemoveSmalltalk: (smalltalk: ArchiveSmalltalk) => void;
};

export function ArchiveList({
  tab,
  articles,
  smalltalks,
  onRemoveArticle,
  onRemoveSmalltalk,
}: ArchiveListProps) {
  const [selectedCategory, setCategory] = useState<Category | "all">("all");

  const items: { category: Category }[] =
    tab === "article" ? articles : smalltalks;
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
    // shortcut: 목데이터 4~7개 기준이라 ScrollView + map. API 연결로 항목이 많아지면 FlatList로 바꿀 것
    <ScrollView contentContainerClassName="gap-5 py-5">
      <View className="gap-3.5">
        <Text className="px-5 text-strong text-heading2-sb">
          내가 직접 담은 {items.length}개의 {ARCHIVE_TABS[tab].label}
        </Text>
        <CategoryFilter chips={chips} value={category} onChange={setCategory} />
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
                  onBookmarkPress={() => onRemoveArticle(article)}
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
                  onBookmarkPress={() => onRemoveSmalltalk(smalltalk)}
                />
              ))}
      </View>
    </ScrollView>
  );
}
