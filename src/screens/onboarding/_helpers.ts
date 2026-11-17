import { INTERESTS } from "@/screens/_constants";
import type { Interest, JobGroup } from "@/stores/onboarding-store";
import {
  fromHHmm,
  fromJobGroupCode,
  fromTravelType,
} from "@/types/user/user.mappers";
import type {
  CategoryResponse,
  OnboardingResponse,
} from "@/types/user/user.types";

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

/**
 * 서버에 저장된 값 중 있는 것만 초안으로 바꾼다 (없는 항목은 화면 기본값 유지).
 * 관심 분야는 카테고리 목록이 있어야 바꿀 수 있어 toInterests로 따로 채운다
 */
export function toOnboardingDraft(res: OnboardingResponse) {
  const jobGroup = (res.jobGroups ?? [])
    .map(fromJobGroupCode)
    .find((code): code is JobGroup => code !== undefined);
  return {
    ...(res.nickname && { nickname: res.nickname }),
    ...(res.travelType && { userType: fromTravelType(res.travelType) }),
    ...(res.commuteStartTime && {
      departureTime: fromHHmm(res.commuteStartTime),
    }),
    ...(res.defaultCommuteMinutes != null && {
      travelMinutes: res.defaultCommuteMinutes,
    }),
    ...(jobGroup && { jobGroup }),
    ...(res.region && { region: res.region }),
  };
}
