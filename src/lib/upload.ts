import { File } from 'expo-file-system';
import { fetch as expoFetch } from 'expo/fetch';

import { getCurrentUserId } from '@/api/auth';
import { api } from '@/api/client';
import { auth, storage } from '@/api/firebase';

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
 * Uploads the local Expo File directly through Expo Fetch so React Native does
 * not need to construct a Blob. Returns the photo id and its Storage path.
 */
export async function uploadPhoto(uri: string): Promise<{ photoId: string; storagePath: string }> {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('Sign in before uploading a photo.');
  const user = auth.currentUser;
  if (!user) throw new Error('Your sign-in session is still loading. Try again.');

  const file = new File(uri);
  const contentType = file.type || 'image/jpeg';
  const ext = EXTENSION[contentType] ?? 'jpg';
  const storagePath =
    'photos/' + userId + '/' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext;
  const bucket = storage.app.options.storageBucket;
  if (!bucket) throw new Error('Firebase Storage bucket is not configured.');
  const token = await user.getIdToken();
  const uploadEndpoint =
    'https://firebasestorage.googleapis.com/v0/b/' + encodeURIComponent(bucket) + '/o?name=' + encodeURIComponent(storagePath);

  console.log('[Firebase Storage] write', {
    query: uploadEndpoint,
    operation: 'resumable upload start + finalize',
    headers: {
      'X-Goog-Upload-Protocol': 'resumable',
      'X-Goog-Upload-Header-Content-Length': file.size,
      'X-Goog-Upload-Header-Content-Type': contentType,
    },
    metadata: { name: storagePath, contentType },
  });

  const startResponse = await expoFetch(uploadEndpoint, {
    method: 'POST',
    headers: {
      Authorization: 'Firebase ' + token,
      'X-Goog-Upload-Protocol': 'resumable',
      'X-Goog-Upload-Command': 'start',
      'X-Goog-Upload-Header-Content-Length': String(file.size),
      'X-Goog-Upload-Header-Content-Type': contentType,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({ name: storagePath, contentType }),
  });
  if (!startResponse.ok) {
    throw new Error('Firebase Storage upload could not start (' + startResponse.status + '): ' + (await startResponse.text()));
  }

  const uploadUrl = startResponse.headers.get('X-Goog-Upload-URL');
  if (!uploadUrl) throw new Error('Firebase Storage did not return a resumable upload URL.');

  const uploadResponse = await expoFetch(uploadUrl, {
    method: 'POST',
    headers: {
      Authorization: 'Firebase ' + token,
      'X-Goog-Upload-Command': 'upload, finalize',
      'X-Goog-Upload-Offset': '0',
      'Content-Type': contentType,
    },
    body: file,
  });
  if (!uploadResponse.ok) {
    throw new Error('Firebase Storage upload failed (' + uploadResponse.status + '): ' + (await uploadResponse.text()));
  }

  const result = (await uploadResponse.json()) as { bucket?: string; name?: string; size?: string; contentType?: string };
  console.log('[Firebase Storage] write accepted', {
    bucket: result.bucket ?? bucket,
    path: result.name ?? storagePath,
    sizeBytes: Number(result.size ?? file.size),
    contentType: result.contentType ?? contentType,
  });

  const photoId = await api.photos.add({ userId }, storagePath);
  return { photoId, storagePath };
}
