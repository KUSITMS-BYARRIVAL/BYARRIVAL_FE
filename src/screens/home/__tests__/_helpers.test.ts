import { getGreeting } from "../_helpers";

describe("getGreeting", () => {
  it.each([
    [4, "좋은 아침이에요!"],
    [11, "좋은 아침이에요!"],
    [12, "좋은 오후예요!"],
    [17, "좋은 오후예요!"],
    [18, "오늘 하루도 수고했어요"],
    [0, "오늘 하루도 수고했어요"],
    [3, "오늘 하루도 수고했어요"],
  ])("%i시에는 '%s'", (hour, greeting) => {
    expect(getGreeting(hour)).toBe(greeting);
  });
});
