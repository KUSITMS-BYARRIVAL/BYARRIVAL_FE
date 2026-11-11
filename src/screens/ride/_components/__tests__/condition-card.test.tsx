import { render, screen, userEvent } from "@testing-library/react-native";

import { WeatherSunnyIcon } from "@/assets/icons";
import { ConditionFaceSunnyIllustration } from "@/assets/illustrations";

import { ConditionCard } from "../condition-card";

const CONDITION = {
  face: <ConditionFaceSunnyIllustration />,
  weatherIcon: <WeatherSunnyIcon />,
  weather: "맑음",
  name: "가뿐해요",
  description: "에너지 충만! 깊이 있는 기사도 거뜬해요!",
};

describe("ConditionCard", () => {
  it("날씨·이름·설명을 보여주고 선택 여부를 checked로 알린다", async () => {
    await render(<ConditionCard {...CONDITION} isSelected />);
    expect(screen.getByText("맑음")).toBeOnTheScreen();
    expect(screen.getByText("가뿐해요")).toBeOnTheScreen();
    expect(
      screen.getByText("에너지 충만! 깊이 있는 기사도 거뜬해요!"),
    ).toBeOnTheScreen();
    expect(screen.getByRole("radio")).toBeChecked();
  });

  it("누르면 onPress를 호출한다", async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    await render(<ConditionCard {...CONDITION} onPress={onPress} />);
    expect(screen.getByRole("radio")).not.toBeChecked();
    await user.press(screen.getByRole("radio"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
