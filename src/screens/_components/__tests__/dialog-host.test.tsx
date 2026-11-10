import { act, render, screen, userEvent } from "@testing-library/react-native";

import { useDialogStore } from "@/stores/dialog-store";

import { DialogHost } from "../dialog-host";

const { openDialog } = useDialogStore.getState();
const open = (options: Parameters<typeof openDialog>[0]) =>
  act(() => openDialog(options));

describe("DialogHost", () => {
  beforeEach(() =>
    useDialogStore.setState({ options: null, isVisible: false }),
  );

  it("openDialog 전에는 아무것도 렌더하지 않는다", async () => {
    await render(<DialogHost />);
    expect(screen.queryByRole("header")).toBeNull();
  });

  it("확인을 누르면 닫히고 onConfirm을 호출한다", async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    await render(<DialogHost />);
    await open({ title: "로그인에 실패했어요", onConfirm });

    expect(
      screen.getByRole("header", { name: "로그인에 실패했어요" }),
    ).toBeOnTheScreen();
    await user.press(screen.getByRole("button", { name: "확인" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("header")).toBeNull();
  });

  it("취소를 누르면 닫히고 onCancel만 호출한다", async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    await render(<DialogHost />);
    await open({ title: "운행을 멈출까요?", onConfirm, onCancel });

    await user.press(screen.getByRole("button", { name: "취소" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
    expect(screen.queryByRole("header")).toBeNull();
  });
});
