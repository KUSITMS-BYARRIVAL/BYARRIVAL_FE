import { fireEvent, render, screen } from "@testing-library/react-native";

import { Tabs } from "../tabs";

const ITEMS = [
  { value: "news", label: "뉴스", count: 3 },
  { value: "word", label: "단어" },
];

describe("Tabs", () => {
  it("value에 해당하는 탭만 선택 상태가 된다", async () => {
    await render(<Tabs items={ITEMS} value="word" onChange={jest.fn()} />);
    expect(screen.getByRole("tab", { name: /단어/ })).toBeSelected();
    expect(screen.getByRole("tab", { name: /뉴스/ })).not.toBeSelected();
  });

  it("count가 있을 때만 개수를 표시한다", async () => {
    await render(<Tabs items={ITEMS} value="news" onChange={jest.fn()} />);
    expect(screen.getByText("· 3")).toBeOnTheScreen();
    expect(screen.queryAllByText(/·/)).toHaveLength(1);
  });

  it("탭을 누르면 해당 value로 onChange를 호출한다", async () => {
    const onChange = jest.fn();
    await render(<Tabs items={ITEMS} value="news" onChange={onChange} />);
    await fireEvent.press(screen.getByRole("tab", { name: /단어/ }));
    expect(onChange).toHaveBeenCalledWith("word");
  });
});
