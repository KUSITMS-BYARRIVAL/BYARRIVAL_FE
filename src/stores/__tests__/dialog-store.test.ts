import { useDialogStore } from "../dialog-store";

const { openDialog, closeDialog } = useDialogStore.getState();

describe("useDialogStore", () => {
  beforeEach(() =>
    useDialogStore.setState({ options: null, isVisible: false }),
  );

  it("openDialog를 호출하면 옵션이 담기고 isVisible이 true가 된다", () => {
    const onConfirm = jest.fn();
    openDialog({ title: "로그인에 실패했어요", onConfirm });

    expect(useDialogStore.getState()).toMatchObject({
      options: { title: "로그인에 실패했어요", onConfirm },
      isVisible: true,
    });
  });

  it("closeDialog를 호출하면 isVisible은 false가 되고 options는 그대로 남는다", () => {
    openDialog({ title: "운행을 멈출까요?", onConfirm: jest.fn() });
    closeDialog();

    const { options, isVisible } = useDialogStore.getState();
    expect(isVisible).toBe(false);
    expect(options?.title).toBe("운행을 멈출까요?");
  });

  it("닫은 뒤 다시 openDialog를 호출하면 새 옵션으로 바뀌고 다시 보인다", () => {
    openDialog({ title: "첫 번째", onConfirm: jest.fn() });
    closeDialog();
    openDialog({ title: "두 번째", onConfirm: jest.fn() });

    const { options, isVisible } = useDialogStore.getState();
    expect(isVisible).toBe(true);
    expect(options?.title).toBe("두 번째");
  });
});
