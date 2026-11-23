import {
  render,
  screen,
  userEvent,
  waitFor,
} from "@testing-library/react-native";
import type { ReactNode } from "react";
import { Platform } from "react-native";

import { useToastStore } from "@/stores/toast-store";

import { ProfilePhoto } from "../profile-photo";

// Jest의 Modal은 닫혀도 onDismiss를 부르지 않아, iOS처럼 닫히면 onDismiss를 부르는 시트로 바꾼다
jest.mock("@/components/bottom-sheet/bottom-sheet", () => {
  const { useEffect, useRef } = jest.requireActual("react");
  const { Pressable, Text } = jest.requireActual("react-native");
  return {
    BottomSheet: ({
      visible,
      onDismiss,
      buttonLabel,
      onButtonPress,
      children,
    }: {
      visible: boolean;
      onDismiss?: () => void;
      buttonLabel: string;
      onButtonPress: () => void;
      children: ReactNode;
    }) => {
      const wasVisible = useRef(visible);
      useEffect(() => {
        if (wasVisible.current && !visible) onDismiss?.();
        wasVisible.current = visible;
      }, [visible, onDismiss]);
      return visible ? (
        <>
          {children}
          <Pressable accessibilityRole="button" onPress={onButtonPress}>
            <Text>{buttonLabel}</Text>
          </Pressable>
        </>
      ) : null;
    },
  };
});
const mockPick = jest.fn();
jest.mock("@/lib/pick-image", () => ({
  pickSquareImage: () => mockPick(),
}));
const mockChange = jest.fn();
jest.mock("@/hooks/mutations/use-change-profile-image", () => ({
  useChangeProfileImage: () => ({ mutate: mockChange, isPending: false }),
}));
const mockRemove = jest.fn();
jest.mock("@/hooks/mutations/use-delete-profile-image", () => ({
  useDeleteProfileImage: () => ({ mutate: mockRemove, isPending: false }),
}));

const IMAGE = { uri: "file:///photo.jpg", mimeType: "image/jpeg" };

beforeEach(() => {
  jest.clearAllMocks();
  mockPick.mockResolvedValue(IMAGE);
});

afterEach(() => {
  jest.restoreAllMocks();
});

async function openSheet(imageUrl: string | null) {
  const user = userEvent.setup();
  await render(<ProfilePhoto imageUrl={imageUrl} />);
  await user.press(screen.getByRole("button", { name: "프로필 사진 바꾸기" }));
  return user;
}

describe("ProfilePhoto", () => {
  it("앨범에서 고른 사진을 업로드한다", async () => {
    const user = await openSheet(null);
    await user.press(screen.getByRole("button", { name: "앨범에서 선택" }));
    await waitFor(() => expect(mockChange).toHaveBeenCalledWith(IMAGE));
  });

  it("시트를 그냥 닫으면 앨범을 열지 않는다", async () => {
    const user = await openSheet(null);
    await user.press(screen.getByRole("button", { name: "취소" }));
    expect(mockPick).not.toHaveBeenCalled();
  });

  it("Android는 시트를 닫으며 바로 앨범을 연다 (onDismiss가 없음)", async () => {
    jest.replaceProperty(Platform, "OS", "android");
    const user = await openSheet(null);
    await user.press(screen.getByRole("button", { name: "앨범에서 선택" }));
    await waitFor(() => expect(mockChange).toHaveBeenCalledWith(IMAGE));
  });

  it("앨범에서 고르다 취소하면 업로드하지 않는다", async () => {
    mockPick.mockResolvedValue(null);
    const user = await openSheet(null);
    await user.press(screen.getByRole("button", { name: "앨범에서 선택" }));
    await waitFor(() => expect(mockPick).toHaveBeenCalled());
    expect(mockChange).not.toHaveBeenCalled();
  });

  it("사진이 없으면 기본 이미지로 변경을 보여주지 않는다", async () => {
    await openSheet(null);
    expect(
      screen.queryByRole("button", { name: "기본 이미지로 변경" }),
    ).not.toBeOnTheScreen();
  });

  it("사진이 있으면 기본 이미지로 변경해 삭제할 수 있다", async () => {
    const user = await openSheet("https://cdn.test/me.jpg");
    await user.press(
      screen.getByRole("button", { name: "기본 이미지로 변경" }),
    );
    expect(mockRemove).toHaveBeenCalledTimes(1);
  });

  it("사진 선택 모듈을 쓸 수 없으면(옛 빌드 등) 알리고 업로드하지 않는다", async () => {
    mockPick.mockRejectedValue(new Error("Cannot find native module"));
    const user = await openSheet(null);
    await user.press(screen.getByRole("button", { name: "앨범에서 선택" }));
    await waitFor(() =>
      expect(useToastStore.getState().toast?.message).toBe(
        "사진을 불러오지 못했어요",
      ),
    );
    expect(mockChange).not.toHaveBeenCalled();
  });
});
