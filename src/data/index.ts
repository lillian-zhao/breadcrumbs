import type { NearbyPlace, Photo } from './types';

export type * from './types';
export * from './hooks';
export { emptyPhoto } from './photos';

// Screens read through the API-backed hooks in ./hooks. What remains below is
// sample content from the Figma file for features the backend doesn't cover yet
// (map pins and place search).

const photos = {
  bubbleTea: { source: require('@assets/photos/bubble-tea.png') },
  morningWalk: { source: require('@assets/photos/morning-walk.png') },
} satisfies Record<string, Photo>;

export const mapPhotos = {
  morningWalk: photos.morningWalk,
  cafe: photos.bubbleTea,
};

export const nearbyPlaces: NearbyPlace[] = [
  {
    id: 'cafe',
    name: 'Cafe',
    subtitle: 'Oakland, Pittsburgh · Coffee',
    detail: '10:30 am · Part of your day’s trail',
    status: 'selected',
  },
  { id: 'walk', name: 'Morning walk', subtitle: 'Pittsburgh · Already added at 9:15 am', status: 'added' },
  { id: 'commonplace', name: 'Commonplace Coffee', subtitle: 'Pittsburgh · Coffee shop', status: 'choose' },
];
