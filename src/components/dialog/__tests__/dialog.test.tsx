import { render, screen, userEvent } from "@testing-library/react-native";

import { Dialog } from "../dialog";

const button = (name: string) => screen.getByRole("button", { name });

describe("Dialog", () => {
  it("제목과 설명을 렌더한다", async () => {
    await render(
      <Dialog
        visible
        title="로그인에 실패했어요"
        description="잠시 후 다시 시도해주세요."
        onConfirm={jest.fn()}
      />,
    );
    expect(
      screen.getByRole("header", { name: "로그인에 실패했어요" }),
    ).toBeOnTheScreen();
    expect(screen.getByText("잠시 후 다시 시도해주세요.")).toBeOnTheScreen();
  });

  it("onCancel이 없으면 확인 버튼 하나만 렌더한다", async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    await render(<Dialog visible title="제목" onConfirm={onConfirm} />);
    expect(screen.getAllByRole("button")).toHaveLength(1);
    await user.press(button("확인"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("onCancel을 넘기면 취소·확인 버튼을 렌더하고 각각 호출한다", async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    await render(
      <Dialog
        visible
        title="운행을 멈출까요?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );
    await user.press(button("취소"));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
    await user.press(button("확인"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("confirmLabel로 확인 버튼 문구를 바꾸고 누르면 onConfirm을 호출한다", async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    await render(
      <Dialog
        visible
        title="보관함에서 삭제할까요?"
        confirmLabel="삭제"
        confirmColor="danger"
        onConfirm={onConfirm}
        onCancel={jest.fn()}
      />,
    );
    expect(screen.queryByRole("button", { name: "확인" })).toBeNull();
    await user.press(button("삭제"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("visible이 false면 렌더하지 않는다", async () => {
    await render(<Dialog visible={false} title="제목" onConfirm={jest.fn()} />);
    expect(screen.queryByText("제목")).toBeNull();
  });
});
