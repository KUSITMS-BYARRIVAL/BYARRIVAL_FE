import * as ImagePicker from "expo-image-picker";

/** 앨범에서 정사각형으로 자른 사진 하나. 취소하면 null */
export async function pickSquareImage(): Promise<{
  uri: string;
  mimeType: string;
} | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
    // 서버가 HEIC를 받지 않아 가장 호환되는 형식(JPEG)으로 받는다
    preferredAssetRepresentationMode:
      ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
  });
  const asset = result.canceled ? null : result.assets[0];
  if (!asset) return null;
  return { uri: asset.uri, mimeType: asset.mimeType ?? "image/jpeg" };
}
