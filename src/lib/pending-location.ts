/** Location selected for the crumb currently being composed. */
export type PendingLocation = {
  placeName: string;
  city: string;
  visitedAt: Date;
  latitude: number | null;
  longitude: number | null;
};

let pendingLocation: PendingLocation | null = null;

export function setPendingLocation(location: PendingLocation) {
  pendingLocation = location;
}

export function getPendingLocation() {
  return pendingLocation;
}

export function clearPendingLocation() {
  pendingLocation = null;
}
