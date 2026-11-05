import { render, screen, userEvent } from "@testing-library/react-native";

import { AssetSuitIllustration } from "@/assets/illustrations";

import { AssetTile } from "../asset-tile";

describe("AssetTile", () => {
  it("선택 여부를 selected 상태로 알린다", async () => {
    await render(
      <AssetTile asset={<AssetSuitIllustration />} label="정장" isSelected />,
    );
    expect(screen.getByRole("button", { name: "정장" })).toBeSelected();
  });

  it("누르면 onPress를 호출한다", async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    await render(
      <AssetTile
        asset={<AssetSuitIllustration />}
        label="정장"
        onPress={onPress}
      />,
    );
    const tile = screen.getByRole("button", { name: "정장" });
    expect(tile).not.toBeSelected();
    await user.press(tile);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
