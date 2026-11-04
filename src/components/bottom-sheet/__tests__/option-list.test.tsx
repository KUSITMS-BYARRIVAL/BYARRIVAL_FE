import { fireEvent, render, screen } from "@testing-library/react-native";

import { OptionList } from "../option-list";

const OPTIONS = [
  { label: "최신순", value: "latest" },
  { label: "오래된순", value: "oldest" },
] as const;

describe("OptionList", () => {
  it("선택한 옵션만 checked이고 굵은 글자를 쓴다", async () => {
    await render(
      <OptionList options={[...OPTIONS]} value="latest" onChange={jest.fn()} />,
    );
    expect(screen.getByRole("radio", { name: "최신순" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "오래된순" })).not.toBeChecked();
    expect(screen.getByText("최신순").props.className).toContain(
      "text-body1-sb",
    );
    expect(screen.getByText("오래된순").props.className).toContain(
      "text-secondary",
    );
  });

  it("옵션을 누르면 그 값으로 onChange를 호출한다", async () => {
    const onChange = jest.fn();
    await render(
      <OptionList options={[...OPTIONS]} value="latest" onChange={onChange} />,
    );
    await fireEvent.press(screen.getByRole("radio", { name: "오래된순" }));
    expect(onChange).toHaveBeenCalledWith("oldest");
  });
});
