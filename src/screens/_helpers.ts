import * as WebBrowser from "expo-web-browser";

import { INTERESTS, JOB_GROUPS } from "@/screens/_constants";
import type { Interest } from "@/stores/onboarding-store";
import { fromJobGroupCode } from "@/types/user/user.mappers";
import type { CategoryResponse } from "@/types/user/user.types";

// 온보딩 · 마이 관심 분야에서 함께 쓴다
// 서버 카테고리는 id·이름만 주므로 이름을 앱 선택지(아이콘이 붙은 8개)의 title과 맞춰 짝짓는다
const titleOf = (interest: Interest) =>
  INTERESTS.find(({ value }) => value === interest)?.title;

export const toCategoryIds = (
  interests: Interest[],
  categories: CategoryResponse[],
) =>
  interests.flatMap((interest) => {
    const category = categories.find(({ name }) => name === titleOf(interest));
    return category ? [category.id] : [];
  });

export const toInterests = (
  ids: number[] | null,
  categories: CategoryResponse[],
) =>
  (ids ?? []).flatMap((id) => {
    const name = categories.find((category) => category.id === id)?.name;
    const interest = INTERESTS.find(({ title }) => title === name)?.value;
    return interest ? [interest] : [];
  });

// 홈 · 공감대 전체보기 칩 라벨. 직군 코드가 없으면 전체 칩이다
export const toPopularChipLabel = (jobGroupCode: string | null) => {
  if (!jobGroupCode) return "전체";
  const jobGroup = fromJobGroupCode(jobGroupCode);
  const title = JOB_GROUPS.find(({ value }) => value === jobGroup)?.title;
  return `내 직군 · ${title ?? jobGroupCode}`;
};

// 서버가 준 주소라도 https 원문만 연다 (스킴은 대소문자를 가리지 않는다)
export const openArticle = (url: string) => {
  if (/^https:\/\//i.test(url)) WebBrowser.openBrowserAsync(url);
};
