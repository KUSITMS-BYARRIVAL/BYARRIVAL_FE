import { useProfileStore } from "../profile-store";

const initial = useProfileStore.getState();

describe("useProfileStore", () => {
  beforeEach(() => useProfileStore.setState(initial, true));

  it("관심 분야를 고르면 끝에 더하고, 다시 고르면 뺀다", () => {
    const { toggleInterest } = useProfileStore.getState();
    toggleInterest("culture");
    expect(useProfileStore.getState().interests).toEqual([
      "economy",
      "tech",
      "culture",
    ]);
    toggleInterest("economy");
    expect(useProfileStore.getState().interests).toEqual(["tech", "culture"]);
  });

  it("요일별 이동 시간은 그 요일만 바꾸고 기본값은 그대로 둔다", () => {
    useProfileStore.getState().setTravelMinutes("thu", 60);
    const { travelMinutes } = useProfileStore.getState();
    expect(travelMinutes.byWeekday.thu).toBe(60);
    expect(travelMinutes.byWeekday.mon).toBe(30);
    expect(travelMinutes.base).toBe(30);
  });

  it("요일별 출근 시각을 바꾸면 쉬는 날도 시각이 생긴다", () => {
    useProfileStore.getState().setDepartureTime("sat", { hour: 9, minute: 30 });
    expect(useProfileStore.getState().departureTimes.byWeekday.sat).toEqual({
      hour: 9,
      minute: 30,
    });
  });
});
