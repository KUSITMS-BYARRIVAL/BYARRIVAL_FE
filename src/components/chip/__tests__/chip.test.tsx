import { fireEvent, render, screen } from "@testing-library/react-native";

import { Chip } from "../chip";

const chip = () => screen.getByRole("button", { name: "텍스트" });

describe("Chip", () => {
  it("기본은 선택 상태로 초록 배경과 brand 글자를 쓴다", async () => {
    await render(<Chip label="텍스트" />);
    expect(chip().props.className).toContain("bg-green-opacity-100");
    expect(screen.getByText("텍스트").props.className).toContain("text-brand");
    expect(chip()).toBeSelected();
  });

  it("미선택이면 흰 배경과 tertiary 글자를 쓴다", async () => {
    await render(<Chip label="텍스트" selected={false} />);
    expect(chip().props.className).toContain("bg-white");
    expect(screen.getByText("텍스트").props.className).toContain(
      "text-tertiary",
    );
  });

  it("onDelete가 없으면 삭제 버튼을 렌더하지 않는다", async () => {
    await render(<Chip label="텍스트" />);
    expect(screen.queryByLabelText("텍스트 삭제")).toBeNull();
  });

  it("삭제 버튼을 누르면 onDelete만 호출한다", async () => {
    const onPress = jest.fn();
    const onDelete = jest.fn();
    await render(<Chip label="텍스트" onPress={onPress} onDelete={onDelete} />);
    await fireEvent.press(screen.getByLabelText("텍스트 삭제"));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("칩을 누르면 onPress를 호출한다", async () => {
    const onPress = jest.fn();
    await render(<Chip label="텍스트" onPress={onPress} />);
    await fireEvent.press(chip());
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
