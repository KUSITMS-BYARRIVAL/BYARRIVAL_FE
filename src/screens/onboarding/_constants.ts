import type { ComponentType } from "react";
import type { SvgProps } from "react-native-svg";

import {
  OnboardingCommuteOtherIllustration,
  OnboardingCommuteStudentIllustration,
  OnboardingCommuteWorkerIllustration,
} from "@/assets/illustrations";
import type { UserType } from "@/stores/onboarding-store";

// 이 도메인의 여러 화면이 함께 쓰는 값만 둔다. 한 화면에서만 쓰는 문구는 그 화면 파일에 둔다

// 온보딩 단계 수 (닉네임·유형·출근 시각·이동 시간·관심 분야·직군·근무지). Figma Progress Stepper 7단계
export const ONBOARDING_STEPS = 7;

// 닉네임을 입력하기 전 보여줄 기본 닉네임 (화면설계서 ONB-04)
export const DEFAULT_NICKNAME = "출근러";

// 직군·근무 지역을 묻는 이유 안내 (Figma 온보딩_수정_최최종 Step6·Step7 Privacy note). 두 화면 모두 설명 문구 바로 아래에 둔다
export const PRIVACY_NOTE =
  "같은 직군 분들이 많이 보는 콘텐츠를 보여드리는 데만 써요.\n프로필에서 언제든 바꿀 수 있어요.";

// 지하철 좌석 일러스트 (Figma Onboarding_CommuteTime, 393×279). 출근 시각·이동 시간 화면에서 유형별로 함께 쓴다
export const COMMUTE_ILLUSTRATIONS: Record<
  UserType,
  ComponentType<SvgProps>
> = {
  worker: OnboardingCommuteWorkerIllustration,
  student: OnboardingCommuteStudentIllustration,
  other: OnboardingCommuteOtherIllustration,
};
