// 목표 시간 T 대비 담을 수 있는 범위 (RIDE-10)
const MIN_RATIO = 0.7;
const MAX_RATIO = 1.2;

/** 이 카드를 더 담아도 합계가 T×120%를 넘지 않는지 */
export function canAddToCart(
  totalMinutes: number,
  minutes: number,
  targetMinutes: number,
) {
  return totalMinutes + minutes <= targetMinutes * MAX_RATIO;
}

/** 합계가 T의 70~120%이거나, 담지 않은 카드 중 더 담을 수 있는 게 없으면 시작할 수 있다 */
export function isCartStartable(
  totalMinutes: number,
  unselectedMinutes: number[],
  targetMinutes: number,
) {
  const isInRange =
    totalMinutes >= targetMinutes * MIN_RATIO &&
    totalMinutes <= targetMinutes * MAX_RATIO;
  const hasMoreCards = unselectedMinutes.some((minutes) =>
    canAddToCart(totalMinutes, minutes, targetMinutes),
  );
  return isInRange || !hasMoreCards;
}
