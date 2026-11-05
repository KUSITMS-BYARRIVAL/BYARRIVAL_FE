import { render, screen, userEvent } from "@testing-library/react-native";

import { RegionPanel } from "../region-panel";

const PROVINCES = ["서울", "경기"];
const DISTRICTS = ["서울전체", "강남구", "강동구"];

async function renderPanel(selectedDistricts = ["강남구"]) {
  const onProvincePress = jest.fn();
  const onDistrictPress = jest.fn();
  await render(
    <RegionPanel
      provinces={PROVINCES}
      selectedProvince="서울"
      onProvincePress={onProvincePress}
      districts={DISTRICTS}
      selectedDistricts={selectedDistricts}
      onDistrictPress={onDistrictPress}
    />,
  );
  return { onProvincePress, onDistrictPress };
}

describe("RegionPanel", () => {
  it("선택한 시·도와 체크한 구·군을 상태로 알린다", async () => {
    await renderPanel();
    expect(screen.getByRole("tab", { name: "서울" })).toBeSelected();
    expect(screen.getByRole("tab", { name: "경기" })).not.toBeSelected();
    expect(screen.getByRole("checkbox", { name: "강남구" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "강동구" })).not.toBeChecked();
  });

  it("여러 구·군을 함께 체크할 수 있다", async () => {
    await renderPanel(["강남구", "강동구"]);
    expect(screen.getByRole("checkbox", { name: "강동구" })).toBeChecked();
  });

  it("시·도와 구·군을 누르면 각각의 콜백을 그 값으로 호출한다", async () => {
    const user = userEvent.setup();
    const { onProvincePress, onDistrictPress } = await renderPanel();
    await user.press(screen.getByRole("tab", { name: "경기" }));
    expect(onProvincePress).toHaveBeenCalledWith("경기");
    await user.press(screen.getByRole("checkbox", { name: "서울전체" }));
    expect(onDistrictPress).toHaveBeenCalledWith("서울전체");
  });
});
