export type ScrapType = "ARTICLE" | "SMALLTALK";

export type LibraryParams = {
  type?: ScrapType;
  sort?: "LATEST" | "OLDEST";
  categoryId?: number;
};

export type LibraryArticle = {
  scrapId: number;
  articleId: number;
  available: boolean;
  title: string;
  pressName: string;
  publishedAt: string;
  categoryId: number;
  categoryName: string;
  oneLine: string;
  readingMinutes: number;
  sourceUrl: string;
  scrappedAt: string;
};

export type LibrarySmalltalk = {
  scrapId: number;
  smalltalkId: number;
  available: boolean;
  hook: string;
  categoryId: number;
  categoryName: string;
  articleTitle: string;
  sourceUrl: string;
  scrappedAt: string;
};

export type Library = {
  type: ScrapType;
  counts: { article: number; smalltalk: number };
  categories: { categoryId: number; name: string; count: number }[];
  articles: LibraryArticle[];
  smalltalks: LibrarySmalltalk[];
};

export type ScrapStatus = {
  targetId: number;
  scrapped: boolean;
};
