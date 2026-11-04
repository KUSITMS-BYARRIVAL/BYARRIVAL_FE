import { fireEvent, render, screen } from "@testing-library/react-native";

import { SegmentedControl } from "../segmented-control";

const OPTIONS = [
  { value: "day", label: "일간" },
  { value: "week", label: "주간" },
];

describe("SegmentedControl", () => {
  it("value에 해당하는 옵션만 선택 상태가 된다", async () => {
    await render(
      <SegmentedControl options={OPTIONS} value="week" onChange={jest.fn()} />,
    );
    expect(screen.getByRole("tab", { name: "주간" })).toBeSelected();
    expect(screen.getByRole("tab", { name: "일간" })).not.toBeSelected();
  });

  it("옵션을 누르면 해당 value로 onChange를 호출한다", async () => {
    const onChange = jest.fn();
    await render(
      <SegmentedControl options={OPTIONS} value="week" onChange={onChange} />,
    );
    await fireEvent.press(screen.getByRole("tab", { name: "일간" }));
    expect(onChange).toHaveBeenCalledWith("day");
  });
});
