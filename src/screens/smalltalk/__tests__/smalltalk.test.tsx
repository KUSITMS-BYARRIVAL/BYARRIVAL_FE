import { render, screen, userEvent } from "@testing-library/react-native";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";

import { EDITOR_PICK_SMALLTALKS } from "@/mocks/smalltalk";

import { SmalltalkScreen } from "../smalltalk";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock("expo-router", () => ({ router: { back: jest.fn() } }));
jest.mock("expo-web-browser", () => ({ openBrowserAsync: jest.fn() }));

describe("SmalltalkScreen", () => {
  it("오늘의 스몰토크를 모두 보여준다", async () => {
    await render(<SmalltalkScreen />);
    expect(screen.getByText("Editor’s Pick")).toBeOnTheScreen();
    expect(screen.getByText("오늘 바로 쓰는 스몰토크")).toBeOnTheScreen();
    for (const { question } of EDITOR_PICK_SMALLTALKS) {
      expect(screen.getByText(question)).toBeOnTheScreen();
    }
  });

  it("카드를 누르면 원문을 열고, 뒤로가기를 누르면 돌아간다", async () => {
    const user = userEvent.setup();
    await render(<SmalltalkScreen />);
    const [first] = EDITOR_PICK_SMALLTALKS;
    await user.press(screen.getByText(first.question));
    expect(WebBrowser.openBrowserAsync).toHaveBeenCalledWith(first.url);
    await user.press(screen.getByRole("button", { name: "뒤로가기" }));
    expect(router.back).toHaveBeenCalled();
  });

  it("북마크를 누르면 담기고, 다시 누르면 빠진다", async () => {
    const user = userEvent.setup();
    await render(<SmalltalkScreen />);
    const [bookmark] = screen.getAllByRole("button", { name: "북마크" });
    expect(bookmark).not.toBeSelected();
    await user.press(bookmark);
    expect(bookmark).toBeSelected();
    await user.press(bookmark);
    expect(bookmark).not.toBeSelected();
  });
});
