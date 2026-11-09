import { ref, uploadBytes } from 'firebase/storage';

import { getCurrentUserId } from '@/api/auth';
import { api } from '@/api/client';
import { storage } from '@/api/firebase';

/**
 * Upload a local image uri to Cloud Storage and record its photo document.
 * Returns the photo id and its Storage path.
 */
export async function uploadPhoto(uri: string): Promise<{ photoId: string; storagePath: string }> {
  const response = await fetch(uri);
  const blob = await response.blob();
  const userId = getCurrentUserId() ?? 'anonymous';
  const storagePath = 'photos/' + userId + '/' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8) + '.jpg';
  await uploadBytes(ref(storage, storagePath), blob);
  const photoId = await api.photos.add({ userId: getCurrentUserId() ?? '' }, storagePath);
  return { photoId, storagePath };
}
