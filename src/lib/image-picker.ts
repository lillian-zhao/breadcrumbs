import * as ImagePicker from 'expo-image-picker';

/** Result of picking an image from the device library. */
export type PickedImage = {
  uri: string;
  width: number;
  height: number;
};

/**
 * Launch the system photo library and return the first selected image, or null
 * if the user cancelled or permission was denied.
 */
export async function pickImageFromLibrary(): Promise<PickedImage | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 0.8,
  });

  if (result.canceled || !result.assets || result.assets.length === 0) {
    return null;
  }

  const asset = result.assets[0];
  return { uri: asset.uri, width: asset.width, height: asset.height };
}
