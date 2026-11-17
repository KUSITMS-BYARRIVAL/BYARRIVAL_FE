import { render, screen, userEvent } from "@testing-library/react-native";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";

import type { Smalltalk } from "@/types/smalltalk/smalltalk.types";

import { SmalltalkScreen } from "../smalltalk";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({ router: { back: jest.fn() } }));
jest.mock("expo-web-browser", () => ({ openBrowserAsync: jest.fn() }));

const mockQuery = jest.fn();
jest.mock("@/hooks/queries/use-get-today-smalltalks", () => ({
  useGetTodaySmalltalks: () => mockQuery(),
}));

const mockSave = jest.fn();
const mockUnsave = jest.fn();
jest.mock("@/hooks/mutations/use-save-smalltalk", () => ({
  useSaveSmalltalk: () => ({ mutate: mockSave }),
}));
jest.mock("@/hooks/mutations/use-unsave-smalltalk", () => ({
  useUnsaveSmalltalk: () => ({ mutate: mockUnsave }),
}));

const smalltalk = (id: number, overrides?: Partial<Smalltalk>): Smalltalk => ({
  smalltalkId: id,
  hook: `한마디 ${id}`,
  categoryId: 4,
  categoryName: "경제",
  articleId: id,
  articleTitle: `기사 ${id}`,
  sourceUrl: `https://news.example/${id}`,
  scrapped: false,
  ...overrides,
});

const withSmalltalks = (smalltalks: Smalltalk[]) =>
  mockQuery.mockReturnValue({
    data: { serviceDate: "2026-11-17", smalltalks },
    isPending: false,
  });

beforeEach(() => jest.clearAllMocks());

describe("SmalltalkScreen", () => {
  it("오늘의 스몰토크를 모두 보여준다", async () => {
    withSmalltalks([smalltalk(1), smalltalk(2)]);
    await render(<SmalltalkScreen />);
    expect(screen.getByText("오늘 바로 쓰는 스몰토크")).toBeOnTheScreen();
    expect(screen.getByText("한마디 1")).toBeOnTheScreen();
    expect(screen.getByText("기사 2")).toBeOnTheScreen();
  });

  it("불러오는 중에는 카드를 보여주지 않는다", async () => {
    mockQuery.mockReturnValue({ data: undefined, isPending: true });
    await render(<SmalltalkScreen />);
    expect(screen.queryByText("오늘의 스몰토크를 준비하고 있어요")).toBeNull();
    expect(screen.queryAllByRole("button", { name: "북마크" })).toHaveLength(0);
  });

  it("오늘 스몰토크가 없으면 준비 중 문구를 보여준다", async () => {
    withSmalltalks([]);
    await render(<SmalltalkScreen />);
    expect(
      screen.getByText("오늘의 스몰토크를 준비하고 있어요"),
    ).toBeOnTheScreen();
  });

  it("카드를 누르면 원문을 열고, 뒤로가기를 누르면 돌아간다", async () => {
    withSmalltalks([smalltalk(1)]);
    const user = userEvent.setup();
    await render(<SmalltalkScreen />);
    await user.press(screen.getByText("한마디 1"));
    expect(WebBrowser.openBrowserAsync).toHaveBeenCalledWith(
      "https://news.example/1",
    );
    await user.press(screen.getByRole("button", { name: "뒤로가기" }));
    expect(router.back).toHaveBeenCalled();
  });

  it("서버에서 담긴 스몰토크는 북마크된 채로 시작하고, 누르면 바로 빠지며 저장 해제를 보낸다", async () => {
    withSmalltalks([smalltalk(1, { scrapped: true })]);
    const user = userEvent.setup();
    await render(<SmalltalkScreen />);
    const bookmark = screen.getByRole("button", { name: "북마크" });
    expect(bookmark).toBeSelected();
    await user.press(bookmark);
    expect(bookmark).not.toBeSelected();
    expect(mockUnsave).toHaveBeenCalledWith(1, expect.anything());
    expect(mockSave).not.toHaveBeenCalled();
  });

  it("담지 않은 스몰토크는 누르면 바로 담기고 저장을 보낸다", async () => {
    withSmalltalks([smalltalk(1)]);
    const user = userEvent.setup();
    await render(<SmalltalkScreen />);
    const bookmark = screen.getByRole("button", { name: "북마크" });
    await user.press(bookmark);
    expect(bookmark).toBeSelected();
    expect(mockSave).toHaveBeenCalledWith(1, expect.anything());
  });

  it("저장이 실패하면 북마크를 원래대로 되돌린다", async () => {
    withSmalltalks([smalltalk(1)]);
    mockSave.mockImplementation((_id, { onError }) => onError());
    const user = userEvent.setup();
    await render(<SmalltalkScreen />);
    const bookmark = screen.getByRole("button", { name: "북마크" });
    await user.press(bookmark);
    expect(bookmark).not.toBeSelected();
  });

  it("https가 아닌 원문 주소는 열지 않는다", async () => {
    withSmalltalks([smalltalk(1, { sourceUrl: "http://news.example/1" })]);
    const user = userEvent.setup();
    await render(<SmalltalkScreen />);
    await user.press(screen.getByText("한마디 1"));
    expect(WebBrowser.openBrowserAsync).not.toHaveBeenCalled();
  });
});
