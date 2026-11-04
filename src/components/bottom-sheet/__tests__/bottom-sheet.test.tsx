import { fireEvent, render, screen } from "@testing-library/react-native";
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
  await render(
    <BottomSheet
      visible={visible}
      title="정렬"
      onClose={onClose}
      buttonLabel="적용"
      onButtonPress={onButtonPress}
    >
      <Text>본문</Text>
    </BottomSheet>,
    {
      wrapper: ({ children }) => (
        <SafeAreaProvider initialMetrics={METRICS}>{children}</SafeAreaProvider>
      ),
    },
  );
  return { onClose, onButtonPress };
}

describe("BottomSheet", () => {
  it("제목·본문·버튼을 렌더한다", async () => {
    await renderSheet();
    expect(screen.getByRole("header", { name: "정렬" })).toBeOnTheScreen();
    expect(screen.getByText("본문")).toBeOnTheScreen();
  });

  it("버튼을 누르면 onButtonPress를 호출한다", async () => {
    const { onButtonPress, onClose } = await renderSheet();
    await fireEvent.press(screen.getByRole("button", { name: "적용" }));
    expect(onButtonPress).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("바깥 딤을 누르면 onClose를 호출한다", async () => {
    const { onClose } = await renderSheet();
    // 시트가 accessibilityViewIsModal이라 딤은 접근성 트리에서 숨겨진다
    await fireEvent.press(
      screen.getByRole("button", { name: "닫기", includeHiddenElements: true }),
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("스크린리더 이스케이프 제스처로 onClose를 호출한다", async () => {
    const { onClose } = await renderSheet();
    await fireEvent(
      screen.getByRole("header", { name: "정렬" }).parent!,
      "accessibilityEscape",
    );
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("visible이 false면 렌더하지 않는다", async () => {
    await renderSheet(false);
    expect(screen.queryByText("정렬")).toBeNull();
  });
});
