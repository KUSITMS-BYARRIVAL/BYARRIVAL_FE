import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

import type { ARCHIVE_ARTICLES, ARCHIVE_SMALLTALKS } from "@/mocks/archive";
import { CategoryFilter } from "@/screens/archive/_components/category-filter";
import { EditorPickSmalltalkCard } from "@/screens/_components/editor-pick-smalltalk-card";
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
  // Figma 보관함_스몰토크: 담은 항목이 없는 분야도 칩을 모두 보여준다
  const isVisible = (item: { category: Category }) =>
    selectedCategory === "all" || item.category === selectedCategory;
  const isEmpty = !items.some(isVisible);

  return (
    // shortcut: 목데이터 4~7개 기준이라 ScrollView + map. API 연결로 항목이 많아지면 FlatList로 바꿀 것
    <ScrollView contentContainerClassName="gap-5 py-5">
      <View className="gap-3.5">
        <Text className="px-5 text-strong text-heading2-sb">
          스크랩한 {items.length}개의 {ARCHIVE_TABS[tab].label}
        </Text>
        <CategoryFilter
          chips={ARCHIVE_CATEGORIES}
          value={selectedCategory}
          onChange={setCategory}
        />
      </View>
      <View className="gap-3.5 px-5">
        {/* shortcut: 고른 분야에 담은 항목이 없을 때 시안이 없어 탭 빈 문구를 그대로 쓴다 */}
        {isEmpty && (
          <Text className="py-10 text-center text-secondary text-body2-m">
            {ARCHIVE_TABS[tab].empty}
          </Text>
        )}
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
