import { act, render, screen, userEvent } from "@testing-library/react-native";

import { useToastStore } from "@/stores/toast-store";
import type { Library, LibraryArticle } from "@/types/scrap/scrap.types";

import { ArchiveScreen } from "../archive";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({
  router: { setParams: jest.fn(), push: jest.fn() },
  useLocalSearchParams: () => ({}),
}));
jest.mock("@/screens/_components/alarm-button", () => ({
  AlarmButton: () => null,
}));

const mockDelete = jest.fn();
const mockRestore = jest.fn();
let mockLibrary: Library;
jest.mock("@/hooks/queries/use-get-scrap-library", () => ({
  useGetScrapLibrary: () => ({ data: mockLibrary, isPending: false }),
}));
jest.mock("@/hooks/mutations/use-delete-scrap", () => ({
  useDeleteScrap: () => ({ mutateAsync: mockDelete }),
}));
jest.mock("@/hooks/mutations/use-restore-scrap", () => ({
  useRestoreScrap: () => ({ mutate: mockRestore }),
}));

const article = (scrapId: number): LibraryArticle => ({
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
});

const pressUndo = () =>
  act(async () => useToastStore.getState().toast?.onLabelPress?.());

beforeEach(() => {
  jest.clearAllMocks();
  mockLibrary = {
    type: "ARTICLE",
    counts: { article: 1, smalltalk: 0 },
    categories: [{ categoryId: 4, name: "경제·금융", count: 1 }],
    articles: [article(1)],
    smalltalks: [],
  };
});

// 토스트 자동 닫힘 타이머가 테스트 뒤에 남지 않게 한다
afterEach(() => useToastStore.getState().hideToast());

describe("ArchiveScreen", () => {
  it("북마크를 누르면 서버 응답 전에 바로 숨기고 삭제 토스트를 띄운다", async () => {
    const user = userEvent.setup();
    mockDelete.mockReturnValue(new Promise(() => {}));
    await render(<ArchiveScreen />);
    await user.press(screen.getByRole("button", { name: "북마크" }));
    expect(mockDelete).toHaveBeenCalledWith(1);
    expect(screen.queryByText("기사 1")).toBeNull();
    expect(
      screen.getByText(
        "아직 담은 기사가 없어요.\n읽다가 북마크를 눌러 담아보세요",
      ),
    ).toBeOnTheScreen();
    expect(useToastStore.getState().toast?.message).toBe("삭제했어요");
  });

  it("되돌리기를 누르면 바로 다시 보여주고, 삭제가 끝난 뒤에 restore를 보낸다", async () => {
    const user = userEvent.setup();
    let finishDelete = () => {};
    mockDelete.mockReturnValue(
      new Promise<void>((resolve) => (finishDelete = resolve)),
    );
    await render(<ArchiveScreen />);
    await user.press(screen.getByRole("button", { name: "북마크" }));
    await pressUndo();
    expect(screen.getByText("기사 1")).toBeOnTheScreen();
    expect(mockRestore).not.toHaveBeenCalled();
    await act(async () => finishDelete());
    expect(mockRestore).toHaveBeenCalledWith(1);
  });

  it("삭제가 실패하면 다시 보여주고, 되돌리기를 눌러도 restore를 보내지 않는다", async () => {
    const user = userEvent.setup();
    mockDelete.mockRejectedValue(new Error("fail"));
    await render(<ArchiveScreen />);
    await user.press(screen.getByRole("button", { name: "북마크" }));
    expect(screen.getByText("기사 1")).toBeOnTheScreen();
    await pressUndo();
    expect(mockRestore).not.toHaveBeenCalled();
  });
});
