import { render, screen, userEvent } from "@testing-library/react-native";
import * as WebBrowser from "expo-web-browser";

import type {
  LibraryArticle,
  LibrarySmalltalk,
} from "@/types/scrap/scrap.types";

import { ArchiveList } from "../archive-list";

jest.mock("expo-web-browser", () => ({ openBrowserAsync: jest.fn() }));

const CATEGORIES = [
  { categoryId: 4, name: "경제·금융", count: 1 },
  { categoryId: 6, name: "IT·기술", count: 1 },
  { categoryId: 8, name: "스포츠", count: 1 },
];

const article = (
  scrapId: number,
  overrides?: Partial<LibraryArticle>,
): LibraryArticle => ({
  scrapId,
  articleId: scrapId,
  available: true,
  title: `기사 ${scrapId}`,
  pressName: "언론사",
  publishedAt: "2026-11-17T08:00:00",
  categoryId: 4,
  categoryName: "경제·금융",
  oneLine: `요약 ${scrapId}`,
  readingMinutes: 3,
  sourceUrl: `https://news.example/${scrapId}`,
  scrappedAt: "2026-11-17T09:00:00",
  ...overrides,
});

const smalltalk = (scrapId: number): LibrarySmalltalk => ({
  scrapId,
  smalltalkId: scrapId,
  available: true,
  hook: `한마디 ${scrapId}`,
  categoryId: 6,
  categoryName: "IT·기술",
  articleTitle: `스몰토크 기사 ${scrapId}`,
  sourceUrl: `https://news.example/s${scrapId}`,
  scrappedAt: "2026-11-17T09:00:00",
});

const ARTICLES = [
  article(1),
  article(2, { categoryId: 6, categoryName: "IT·기술" }),
];

const renderList = (props?: Partial<Parameters<typeof ArchiveList>[0]>) =>
  render(
    <ArchiveList
      tab="article"
      articles={ARTICLES}
      smalltalks={[]}
      categories={CATEGORIES}
      onRemove={jest.fn()}
      {...props}
    />,
  );

beforeEach(() => jest.clearAllMocks());

describe("ArchiveList", () => {
  it("담은 개수와, '전체' + 담은 항목이 있는 카테고리 칩만 보여준다", async () => {
    await renderList();
    expect(screen.getByText("스크랩한 2개의 기사")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "전체" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "경제·금융" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "IT·기술" })).toBeOnTheScreen();
    expect(screen.queryByRole("button", { name: "스포츠" })).toBeNull();
  });

  it("카테고리 칩을 누르면 그 카테고리 기사만 보여준다", async () => {
    const user = userEvent.setup();
    await renderList();
    await user.press(screen.getByRole("button", { name: "IT·기술" }));
    expect(screen.getByText("기사 2")).toBeOnTheScreen();
    expect(screen.queryByText("기사 1")).toBeNull();
  });

  it("고른 카테고리의 항목이 모두 빠지면 칩이 사라지고 '전체'로 보여준다", async () => {
    const user = userEvent.setup();
    const { rerender } = await renderList();
    await user.press(screen.getByRole("button", { name: "IT·기술" }));
    await rerender(
      <ArchiveList
        tab="article"
        articles={[ARTICLES[0]]}
        smalltalks={[]}
        categories={CATEGORIES}
        onRemove={jest.fn()}
      />,
    );
    expect(screen.queryByRole("button", { name: "IT·기술" })).toBeNull();
    expect(screen.getByRole("button", { name: "전체" })).toBeSelected();
    expect(screen.getByText("기사 1")).toBeOnTheScreen();
  });

  it("카드를 누르면 원문을 열고, 북마크를 누르면 그 scrapId로 onRemove를 호출한다", async () => {
    const user = userEvent.setup();
    const onRemove = jest.fn();
    await renderList({ articles: [ARTICLES[0]], onRemove });
    await user.press(screen.getByText("기사 1"));
    expect(WebBrowser.openBrowserAsync).toHaveBeenCalledWith(
      "https://news.example/1",
    );
    await user.press(screen.getByRole("button", { name: "북마크" }));
    expect(onRemove).toHaveBeenCalledWith(1);
  });

  it("https가 아닌 원문 주소는 열지 않는다", async () => {
    const user = userEvent.setup();
    await renderList({
      articles: [article(1, { sourceUrl: "http://news.example/1" })],
    });
    await user.press(screen.getByText("기사 1"));
    expect(WebBrowser.openBrowserAsync).not.toHaveBeenCalled();
  });

  it("원문이 사라진 기사는 요약 대신 '삭제된 기사예요'를 보여준다", async () => {
    await renderList({ articles: [article(1, { available: false })] });
    expect(screen.getByText("삭제된 기사예요")).toBeOnTheScreen();
    expect(screen.queryByText("요약 1")).toBeNull();
  });

  it("스몰토크 탭은 질문 문구와 기사 제목을 보여준다", async () => {
    await renderList({ tab: "smalltalk", smalltalks: [smalltalk(3)] });
    expect(screen.getByText("스크랩한 1개의 스몰토크")).toBeOnTheScreen();
    expect(screen.getByText("한마디 3")).toBeOnTheScreen();
    expect(screen.getByText("스몰토크 기사 3")).toBeOnTheScreen();
  });
});
