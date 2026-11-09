import { File } from 'expo-file-system';
import { ref, uploadBytes } from 'firebase/storage';

import { getCurrentUserId } from '@/api/auth';
import { api } from '@/api/client';
import { storage } from '@/api/firebase';

const EXTENSION: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
  'image/heif': 'heif',
  'image/gif': 'gif',
};

/**
 * Upload a local image uri to Cloud Storage and record its photo document.
 * Reads the file through expo-file-system (rather than fetch, which produced
 * corrupted/empty blobs) and sets an explicit content type. Returns the photo
 * id and its Storage path.
 */
export async function uploadPhoto(uri: string): Promise<{ photoId: string; storagePath: string }> {
  const userId = getCurrentUserId() ?? 'anonymous';
  const file = new File(uri);
  const contentType = file.type || 'image/jpeg';
  const ext = EXTENSION[contentType] ?? 'jpg';
  const storagePath =
    'photos/' + userId + '/' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext;

  const data = await file.arrayBuffer();
  await uploadBytes(ref(storage, storagePath), data, { contentType });

  const photoId = await api.photos.add({ userId: getCurrentUserId() ?? '' }, storagePath);
  return { photoId, storagePath };
}
