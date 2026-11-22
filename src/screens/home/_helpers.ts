/** 서비스일이 바뀌는 새벽 4시부터 아침으로 본다. hour는 0~23 */
export const getGreeting = (hour: number) => {
  if (hour >= 4 && hour < 12) return "좋은 아침이에요!";
  if (hour >= 12 && hour < 18) return "좋은 오후예요!";
  return "오늘 하루도 수고했어요";
};
