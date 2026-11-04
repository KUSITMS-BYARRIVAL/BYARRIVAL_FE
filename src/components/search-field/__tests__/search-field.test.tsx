import { fireEvent, render, screen } from "@testing-library/react-native";

import { SearchField } from "../search-field";

describe("SearchField", () => {
  it("입력하면 onChangeText를 호출한다", async () => {
    const onChangeText = jest.fn();
    await render(
      <SearchField placeholder="검색" onChangeText={onChangeText} />,
    );
    await fireEvent.changeText(screen.getByPlaceholderText("검색"), "뉴스");
    expect(onChangeText).toHaveBeenCalledWith("뉴스");
  });
});
