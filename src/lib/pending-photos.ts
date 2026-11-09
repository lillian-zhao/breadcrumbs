/** A photo uploaded during the current crumb composing session. */
export type PendingPhoto = {
  photoId: string;
  /** Local uri used for an immediate preview before the day is saved. */
  uri: string;
};

let pending: PendingPhoto[] = [];

/** Keep an uploaded photo in the current composer until its crumb is saved. */
export function addPendingPhoto(photoId: string, uri: string) {
  pending.push({ photoId, uri });
}

export function getPendingPhotos(): PendingPhoto[] {
  return [...pending];
}

export function clearPendingPhotos() {
  pending = [];
}
