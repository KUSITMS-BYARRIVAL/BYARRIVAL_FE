import {
  render,
  screen,
  userEvent,
  waitFor,
} from "@testing-library/react-native";

import { ProfilePhoto } from "../profile-photo";

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
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
});
