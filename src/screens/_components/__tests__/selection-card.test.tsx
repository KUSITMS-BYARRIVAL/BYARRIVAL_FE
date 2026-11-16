import { render, screen, userEvent } from "@testing-library/react-native";

import { AssetSuitIllustration } from "@/assets/illustrations";

import { SelectionCard } from "../selection-card";

describe("SelectionCard", () => {
  it("제목·설명을 보여주고 선택 여부를 checked로 알린다", async () => {
    await render(
      <SelectionCard
        asset={<AssetSuitIllustration />}
        title="직장인"
        description="출근길에 읽어요"
        isSelected
      />,
    );
    expect(screen.getByText("출근길에 읽어요")).toBeOnTheScreen();
    expect(
      screen.getByRole("radio", { name: "직장인 출근길에 읽어요" }),
    ).toBeChecked();
  });

  it("누르면 onPress를 호출한다", async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    await render(
      <SelectionCard
        asset={<AssetSuitIllustration />}
        title="직장인"
        onPress={onPress}
      />,
    );
    expect(screen.getByRole("radio")).not.toBeChecked();
    await user.press(screen.getByRole("radio"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
