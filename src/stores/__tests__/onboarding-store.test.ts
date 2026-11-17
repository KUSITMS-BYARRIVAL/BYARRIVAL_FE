import { useOnboardingStore } from "../onboarding-store";

const initial = useOnboardingStore.getState();
const region = {
  sidoId: 1,
  sidoName: "서울",
  sigunguId: 11,
  sigunguName: "강남구",
};

beforeEach(() => {
  useOnboardingStore.setState(initial, true);
});

const state = () => useOnboardingStore.getState();

describe("useOnboardingStore", () => {
  it("초기값은 기본 출발 08:00 · 이동 30분이고 나머지는 비어 있다", () => {
    expect(state()).toMatchObject({
      nickname: "",
      userType: null,
      departureTime: { hour: 8, minute: 0 },
      travelMinutes: 30,
      interests: [],
      jobGroup: null,
      region: null,
      isOnboarded: false,
    });
  });

  it("hydrate는 전달한 필드만 덮어쓰고 나머지는 유지한다", () => {
    state().hydrate({ nickname: "홍길동", region });

    expect(state()).toMatchObject({
      nickname: "홍길동",
      region,
      travelMinutes: 30,
      userType: null,
    });
  });

  it("hydrate에 null과 빈 배열을 넘기면 해당 값이 비워진다", () => {
    state().hydrate({ region, interests: ["tech"] });
    state().hydrate({ region: null, interests: [] });

    expect(state().region).toBeNull();
    expect(state().interests).toEqual([]);
  });

  it("setRegion은 지역을 저장하고 null이면 초기화한다", () => {
    state().setRegion(region);
    expect(state().region).toEqual(region);

    state().setRegion(null);
    expect(state().region).toBeNull();
  });

  it("toggleInterest는 없는 항목을 고른 순서대로 추가한다", () => {
    state().toggleInterest("tech");
    state().toggleInterest("economy");

    expect(state().interests).toEqual(["tech", "economy"]);
  });

  it("toggleInterest는 이미 있는 항목을 제거하고 나머지 순서를 유지한다", () => {
    state().hydrate({ interests: ["tech", "economy", "sports"] });

    state().toggleInterest("economy");

    expect(state().interests).toEqual(["tech", "sports"]);
  });

  it("completeOnboarding은 isOnboarded만 true로 바꾼다", () => {
    state().setNickname("홍길동");

    state().completeOnboarding();

    expect(state().isOnboarded).toBe(true);
    expect(state().nickname).toBe("홍길동");
  });

  it("setTravelMinutes는 이동 시간을 바꾼다", () => {
    state().setTravelMinutes(45);

    expect(state().travelMinutes).toBe(45);
  });

  it("reset은 바뀐 모든 값을 초기값으로 되돌린다", () => {
    state().hydrate({
      nickname: "홍길동",
      userType: "student",
      departureTime: { hour: 9, minute: 30 },
      travelMinutes: 60,
      interests: ["tech"],
      jobGroup: "design",
      region,
    });
    state().completeOnboarding();

    state().reset();

    expect(state()).toMatchObject({
      nickname: "",
      userType: null,
      departureTime: { hour: 8, minute: 0 },
      travelMinutes: 30,
      interests: [],
      jobGroup: null,
      region: null,
      isOnboarded: false,
    });
  });
});
