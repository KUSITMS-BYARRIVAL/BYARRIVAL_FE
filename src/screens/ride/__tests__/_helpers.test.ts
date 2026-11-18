import { findAvailableStop } from "../_helpers";

// 정거장 번호별 available 값으로 조회 함수를 만든다
const fetchStopOf = (availability: Record<number, boolean>) =>
  jest.fn(async (stopNumber: number) => ({
    available: availability[stopNumber]!,
  }));

describe("findAvailableStop", () => {
  it("from 정거장을 볼 수 있으면 그 번호를 돌려준다", async () => {
    const fetchStop = fetchStopOf({ 2: true, 3: true });

    await expect(findAvailableStop(2, 3, fetchStop)).resolves.toBe(2);
    expect(fetchStop).toHaveBeenCalledTimes(1);
  });

  it("볼 수 없는 정거장이 이어지면 모두 건너뛴다", async () => {
    const fetchStop = fetchStopOf({ 2: false, 3: false, 4: true });

    await expect(findAvailableStop(2, 4, fetchStop)).resolves.toBe(4);
  });

  it("끝까지 볼 수 있는 정거장이 없으면 null", async () => {
    const fetchStop = fetchStopOf({ 2: false, 3: false });

    await expect(findAvailableStop(2, 3, fetchStop)).resolves.toBeNull();
  });

  it("from이 마지막 정거장을 넘으면 조회 없이 null", async () => {
    const fetchStop = fetchStopOf({});

    await expect(findAvailableStop(4, 3, fetchStop)).resolves.toBeNull();
    expect(fetchStop).not.toHaveBeenCalled();
  });

  it("조회가 실패하면 그 실패를 그대로 던진다", async () => {
    const fetchStop = jest.fn().mockRejectedValue(new Error("네트워크"));

    await expect(findAvailableStop(2, 3, fetchStop)).rejects.toThrow(
      "네트워크",
    );
  });
});
