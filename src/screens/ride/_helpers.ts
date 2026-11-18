// 숨겼거나 원문이 삭제된 기사(available: false)를 건너뛰고 from부터 처음 볼 수 있는 정거장 번호. 끝까지 없으면 null
export const findAvailableStop = async (
  from: number,
  totalStops: number,
  fetchStop: (stopNumber: number) => Promise<{ available: boolean }>,
) => {
  for (let stopNumber = from; stopNumber <= totalStops; stopNumber++) {
    if ((await fetchStop(stopNumber)).available) return stopNumber;
  }
  return null;
};
