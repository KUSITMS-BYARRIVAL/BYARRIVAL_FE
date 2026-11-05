import { render, screen } from "@testing-library/react-native";

import { AchievementCard } from "../achievement-card";

describe("AchievementCard", () => {
  it.each(["horizontal", "vertical"] as const)(
    "%s 배치에서 제목과 설명을 보여준다",
    async (orientation) => {
      await render(
        <AchievementCard
          title="축하합니다! 당신은 1등 갓생러"
          description="데이터를 집계중입니다"
          orientation={orientation}
        />,
      );
      expect(
        screen.getByText("축하합니다! 당신은 1등 갓생러"),
      ).toBeOnTheScreen();
      expect(screen.getByText("데이터를 집계중입니다")).toBeOnTheScreen();
    },
  );
});
