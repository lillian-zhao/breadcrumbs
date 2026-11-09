import { getDownloadURL, ref } from 'firebase/storage';

import { storage } from '@/api/firebase';

import type { Photo } from './types';

/** Shown wherever a photo is missing; <Photo> renders it as an empty tinted frame. */
export const emptyPhoto: Photo = { source: null };

const urlCache = new Map<string, Promise<string | null>>();

function downloadUrl(path: string): Promise<string | null> {
  let url = urlCache.get(path);
  if (!url) {
    url = getDownloadURL(ref(storage, path)).catch((error: unknown) => {
      // Missing objects are expected in seeded data; fall back to an empty frame.
      console.warn('Could not read Firebase Storage photo at ' + path, error);
      urlCache.delete(path);
      return null;
    });
    urlCache.set(path, url);
  }
  return url;
}

/** Resolve a Cloud Storage path from the API into a renderable Photo. */
export async function resolvePhoto(path: string | null | undefined): Promise<Photo> {
  if (!path) return emptyPhoto;
  const uri = await downloadUrl(path);
  return uri ? { source: { uri } } : emptyPhoto;
}

export function resolvePhotos(paths: (string | null | undefined)[]): Promise<Photo[]> {
  return Promise.all(paths.map(resolvePhoto));
}
