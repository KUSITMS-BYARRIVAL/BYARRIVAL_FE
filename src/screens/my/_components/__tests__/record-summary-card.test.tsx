import { render, screen } from "@testing-library/react-native";

import { RecordSummaryCard } from "../record-summary-card";

const renderCard = (
  props: Partial<React.ComponentProps<typeof RecordSummaryCard>> = {},
) =>
  render(
    <RecordSummaryCard
      year={2026}
      streakDays={5}
      readCount={37}
      readHours={142}
      longestStreakDays={30}
      {...props}
    />,
  );

describe("RecordSummaryCard", () => {
  it("연도를 'N년'으로 표시한다", async () => {
    await renderCard();
    expect(screen.getByText("2026년")).toBeOnTheScreen();
  });

  it("연속 완주 일수를 'N일'로 표시한다", async () => {
    await renderCard();
    expect(screen.getByText("연속 완주")).toBeOnTheScreen();
    expect(screen.getByText("5일")).toBeOnTheScreen();
  });

  it("올해 읽은 기사 수를 'N개'로 표시한다", async () => {
    await renderCard();
    expect(screen.getByText("37개")).toBeOnTheScreen();
  });

  it("올해 읽은 시간을 'N시간'으로 표시한다", async () => {
    await renderCard();
    expect(screen.getByText("142시간")).toBeOnTheScreen();
  });

  it("최장 연속 완주 일수를 'N일'로 표시한다", async () => {
    await renderCard();
    expect(screen.getByText("최장 연속 완주")).toBeOnTheScreen();
    expect(screen.getByText("30일")).toBeOnTheScreen();
  });

  it("모든 값이 0이면 0으로 표시한다", async () => {
    await renderCard({
      streakDays: 0,
      readCount: 0,
      readHours: 0,
      longestStreakDays: 0,
    });
    expect(screen.getAllByText("0일")).toHaveLength(2);
    expect(screen.getByText("0개")).toBeOnTheScreen();
    expect(screen.getByText("0시간")).toBeOnTheScreen();
  });
});
