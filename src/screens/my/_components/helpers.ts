/** 월요일 시작 주 단위 날짜 배열. 달에 속하지 않는 칸은 null */
export function getCalendarWeeks(year: number, month: number) {
  const leadingBlanks = (new Date(year, month - 1, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells = [
    ...Array<null>(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return Array.from({ length: cells.length / 7 }, (_, i) =>
    cells.slice(i * 7, i * 7 + 7),
  );
}

const MAX_BAR_HEIGHT = 85;

/** 보이는 주들 중 최댓값이 가장 높은 막대가 되도록 0~최댓값을 0~85px로 비례시킨다 */
export function getBarHeight(minutes: number, maxMinutes: number) {
  return maxMinutes === 0 ? 0 : (minutes / maxMinutes) * MAX_BAR_HEIGHT;
}
