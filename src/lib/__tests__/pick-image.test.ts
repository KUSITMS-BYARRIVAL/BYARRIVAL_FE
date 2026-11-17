import { launchImageLibraryAsync } from "expo-image-picker";

import { pickSquareImage } from "../pick-image";

jest.mock("expo-image-picker", () => ({
  launchImageLibraryAsync: jest.fn(),
  UIImagePickerPreferredAssetRepresentationMode: { Compatible: "compatible" },
}));

const launch = jest.mocked(launchImageLibraryAsync);

describe("pickSquareImage", () => {
  it("고른 사진의 uri와 형식을 돌려준다", async () => {
    launch.mockResolvedValue({
      canceled: false,
      assets: [{ uri: "file:///a.png", mimeType: "image/png" }],
    } as never);

    await expect(pickSquareImage()).resolves.toEqual({
      uri: "file:///a.png",
      mimeType: "image/png",
    });
    expect(launch).toHaveBeenCalledWith(
      expect.objectContaining({ allowsEditing: true, aspect: [1, 1] }),
    );
  });

  it("형식을 알 수 없으면 JPEG로 본다", async () => {
    launch.mockResolvedValue({
      canceled: false,
      assets: [{ uri: "file:///a.jpg" }],
    } as never);

    await expect(pickSquareImage()).resolves.toMatchObject({
      mimeType: "image/jpeg",
    });
  });

  it("취소하면 null", async () => {
    launch.mockResolvedValue({ canceled: true, assets: null } as never);

    await expect(pickSquareImage()).resolves.toBeNull();
  });
});
