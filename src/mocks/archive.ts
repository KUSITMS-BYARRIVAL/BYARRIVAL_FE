import { BOARDING_ARTICLES } from "@/mocks/ride";

// 원문 링크가 있는 기존 기사를 재사용한다. AI 요약은 임시값이고, 마지막 기사는 원문이 삭제된 상태다
export const ARCHIVE_ARTICLES = [0, 2, 3, 6].map((index, i) => {
  const { category, label, title, url, image } = BOARDING_ARTICLES[index];
  return {
    id: url,
    category,
    label,
    title,
    url,
    image,
    aiSummary: [
      "빼빼로 해외 매출이 1000억 원을 눈앞에 뒀어요",
      "물만 부으면 되는 단백질 제품이 2030에게 인기예요",
      "AMD가 한국을 AI 핵심 파트너로 꼽았어요",
      "미국 선거 결과로 정치 지형이 크게 바뀌었어요",
    ][i],
    isDeleted: i === 3,
  };
});

// 원문 링크가 있도록 탑승 기사 7개에 하나씩 붙였다. 대화 문구는 임시값이고, 마지막 스몰토크는 원문이 삭제된 상태다
export const ARCHIVE_SMALLTALKS = [
  {
    index: 3,
    question:
      "“ AMD가 한국을 AI 핵심 국가로 꼽았대요. 요즘 AI 얘기 정말 많죠? “",
  },
  {
    index: 0,
    question: "“ 빼빼로가 해외에서 1000억 어치나 팔린대요. 신기하지 않아요? “",
  },
  {
    index: 2,
    question: "“ 요즘 물만 부으면 되는 단백질 음료가 인기래요. 드셔보셨어요? “",
  },
  {
    index: 5,
    question: "“ 요즘 금융권 해킹 소식이 많네요. 비밀번호 자주 바꾸세요? “",
  },
  {
    index: 6,
    question: "“ 미국 선거 결과 보셨어요? 분위기가 많이 바뀌었대요. “",
  },
  {
    index: 4,
    question: "“ 구글이 AI 칩을 직접 판다는데, 반도체 주식 괜찮을까요? “",
  },
  {
    index: 1,
    question: "“ 편의점마다 초콜릿 맛이 다르대요. 다 드셔보실 거예요? “",
  },
].map(({ index, question }, i, list) => {
  const { category, label, title, url } = BOARDING_ARTICLES[index];
  return {
    id: `smalltalk-${index}`,
    category,
    label,
    newsTitle: title,
    url,
    question,
    isDeleted: i === list.length - 1,
  };
});
