import {
  fireEvent,
  render,
  screen,
  userEvent,
} from "@testing-library/react-native";
import { Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { BottomSheet } from "../bottom-sheet";

const METRICS = {
  frame: { x: 0, y: 0, width: 393, height: 852 },
  insets: { top: 0, left: 0, right: 0, bottom: 34 },
};

async function renderSheet(visible = true) {
  const onClose = jest.fn();
  const onButtonPress = jest.fn();
  const onDismiss = jest.fn();
  await render(
    <BottomSheet
      visible={visible}
      title="정렬"
      onClose={onClose}
      buttonLabel="적용"
      onButtonPress={onButtonPress}
      onDismiss={onDismiss}
    >
      <Text>본문</Text>
    </BottomSheet>,
    {
      wrapper: ({ children }) => (
        <SafeAreaProvider initialMetrics={METRICS}>{children}</SafeAreaProvider>
      ),
    },
  );
  return { onClose, onButtonPress, onDismiss };
}

describe("BottomSheet", () => {
  it("제목·본문·버튼을 렌더한다", async () => {
    await renderSheet();
    expect(screen.getByRole("header", { name: "정렬" })).toBeOnTheScreen();
    expect(screen.getByText("본문")).toBeOnTheScreen();
  });

  it("버튼을 누르면 onButtonPress를 호출한다", async () => {
    const user = userEvent.setup();
    const { onButtonPress, onClose } = await renderSheet();
    await user.press(screen.getByRole("button", { name: "적용" }));
    expect(onButtonPress).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("손잡이 닫기 버튼을 누르면 onClose를 호출한다", async () => {
    const user = userEvent.setup();
    const { onClose } = await renderSheet();
    await user.press(screen.getByRole("button", { name: "닫기" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("바깥 딤을 누르면 onClose를 호출한다", async () => {
    const user = userEvent.setup();
    const { onClose } = await renderSheet();
    // 시트가 accessibilityViewIsModal이라 딤은 접근성 트리에서 숨겨진다
    await user.press(
      screen.getByRole("button", {
        name: "배경 닫기",
        includeHiddenElements: true,
      }),
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("스크린리더 이스케이프 제스처로 onClose를 호출한다", async () => {
    const { onClose } = await renderSheet();
    // 이스케이프 제스처는 userEvent로 낼 수 없어 이벤트를 직접 보낸다
    await fireEvent(
      screen.getByRole("header", { name: "정렬" }).parent!,
      "accessibilityEscape",
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("Modal이 닫힘을 마치면 onDismiss를 호출한다", async () => {
    const { onDismiss } = await renderSheet();
    // 닫힘 완료는 네이티브 Modal이 보내는 이벤트라 직접 보낸다. dismiss는 버블링되지 않아 Modal(SafeAreaProvider 래퍼의 첫 자식)에 보낸다
    const modal = screen.root!.children[0];
    if (typeof modal === "string") throw new Error("Modal을 찾지 못함");
    await fireEvent(modal, "dismiss");
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("visible이 false면 렌더하지 않는다", async () => {
    await renderSheet(false);
    expect(screen.queryByText("정렬")).toBeNull();
  });
});
