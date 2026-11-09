/** A photo uploaded during the current "log a day" composing session. */
export type PendingPhoto = {
  photoId: string;
  /** Local uri used for an immediate preview before the day is saved. */
  uri: string;
};

let pending: PendingPhoto[] = [];

/** Remember a photo uploaded while composing a day, until it is attached to a crumb. */
export function addPendingPhoto(photoId: string, uri: string) {
  pending.push({ photoId, uri });
}

export function getPendingPhotos(): PendingPhoto[] {
  return [...pending];
}

export function clearPendingPhotos() {
  pending = [];
}
