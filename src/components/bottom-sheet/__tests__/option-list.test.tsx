import { render, screen, userEvent } from "@testing-library/react-native";

import { OptionList } from "../option-list";

const OPTIONS = [
  { label: "최신순", value: "latest" },
  { label: "오래된순", value: "oldest" },
];

const radio = (name: string) => screen.getByRole("radio", { name });

describe("OptionList", () => {
  it("선택한 옵션만 checked로 표시한다", async () => {
    await render(
      <OptionList options={OPTIONS} value="latest" onChange={jest.fn()} />,
    );
    expect(radio("최신순")).toBeChecked();
    expect(radio("오래된순")).not.toBeChecked();
  });

  it("옵션을 누르면 그 값으로 onChange를 호출하고, 바뀐 value로 다시 그리면 그 옵션만 checked다", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const { rerender } = await render(
      <OptionList options={OPTIONS} value="latest" onChange={onChange} />,
    );
    await user.press(radio("오래된순"));
    expect(onChange).toHaveBeenCalledWith("oldest");

    await rerender(
      <OptionList options={OPTIONS} value="oldest" onChange={onChange} />,
    );
    expect(radio("오래된순")).toBeChecked();
    expect(radio("최신순")).not.toBeChecked();
  });
});
