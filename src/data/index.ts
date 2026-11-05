import type {
  Album,
  Crop,
  DayLog,
  Friend,
  FriendWeek,
  GallerySection,
  Highlight,
  LinkedAccount,
  NearbyPlace,
  Photo,
  SavedPlace,
  User,
} from './types';

export type * from './types';

// Sample content from the Figma file. Replace these exports with API-backed hooks when the backend exists.

const photos = {
  bubbleTea: { source: require('@assets/photos/bubble-tea.png') },
  cafeBrunch: { source: require('@assets/photos/cafe-brunch.png') },
  dessertCups: { source: require('@assets/photos/dessert-cups.png') },
  mixerShelves: { source: require('@assets/photos/mixer-shelves.png') },
  morningWalk: { source: require('@assets/photos/morning-walk.png') },
  noodleSoup: { source: require('@assets/photos/noodle-soup.png') },
  plushFriend: { source: require('@assets/photos/plush-friend.png') },
  plushShop: { source: require('@assets/photos/plush-shop.png') },
  purpleLounge: { source: require('@assets/photos/purple-lounge.png') },
  aespaConcert: { source: require('@assets/photos/aespa-concert.png') },
  pottery: { source: require('@assets/photos/pottery.png') },
  lillian: { source: require('@assets/photos/lillian-avatar.png') },
} satisfies Record<string, Photo>;

const tallCrop = (top: `${number}%`): Crop => ({ height: '133.33%', top });

export const today = new Date(2024, 9, 11);

export const currentUser: User = {
  id: 'lillian',
  name: 'Lillian',
  handle: '@lillian',
  bio: 'Little stops, good food, and moments worth keeping.',
  avatar: {
    ...photos.lillian,
    crop: { width: '136.84%', height: '182.46%', left: '-18.66%', top: '-44.93%' },
  },
  daysLogged: 123,
  followers: 3,
  following: 3,
};

export const friends: Friend[] = [
  {
    id: 'annie',
    name: 'Annie',
    handle: '@annie',
    bio: 'Little stops, good company, things worth remembering.',
    avatar: photos.plushShop,
  },
  {
    id: 'alicia',
    name: 'Alicia',
    handle: '@alicia',
    bio: 'Coffee, clay, and a slow Saturday.',
    avatar: photos.cafeBrunch,
  },
  {
    id: 'tongtong',
    name: 'Tongtong',
    handle: '@tongtong',
    bio: 'Late lights and leftover songs.',
    avatar: photos.purpleLounge,
  },
  {
    id: 'mary',
    name: 'Mary',
    handle: '@mary',
    bio: 'Always a table for two.',
    avatar: photos.purpleLounge,
  },
  {
    id: 'maggie',
    name: 'Maggie',
    handle: '@maggie',
    bio: 'Kitchens, colors, and a well-stocked shelf.',
    avatar: photos.mixerShelves,
  },
];

export function getFriend(id: string) {
  const friend = friends.find((candidate) => candidate.id === id);
  if (!friend) throw new Error(`Unknown friend: ${id}`);
  return friend;
}

export const weeklyWrapped: Photo[] = [
  photos.bubbleTea,
  { ...photos.noodleSoup, crop: { height: '145.45%', top: '-45.4%' } },
  photos.dessertCups,
  photos.plushFriend,
];

export const friendWeeks: FriendWeek[] = [
  { friendId: 'annie', cover: { ...photos.plushShop, crop: tallCrop('-28.51%') }, places: 12, newPlaces: 3 },
  { friendId: 'alicia', cover: { ...photos.cafeBrunch, crop: tallCrop('-38.19%') }, places: 7, newPlaces: 1 },
  { friendId: 'tongtong', cover: photos.purpleLounge, places: 2, newPlaces: 0 },
  { friendId: 'maggie', cover: photos.mixerShelves, places: 8, newPlaces: 1 },
];

export const featuredFriendIds = ['annie', 'alicia', 'mary', 'maggie'];

export const savedPlaces: SavedPlace[] = [
  { id: 'bistro', name: 'The Bistro', category: 'Italian', price: '$$', photo: photos.purpleLounge },
  { id: 'park-cafe', name: 'Park Café', category: 'Coffee', price: '$', photo: photos.cafeBrunch },
  { id: 'rooftop', name: 'Rooftop Bar', category: 'Bar', price: '$$$', photo: photos.mixerShelves },
];

export const albums: Album[] = [
  { id: 'summer-2024', title: 'Summer 2024', photoCount: 24, cover: photos.plushShop },
  { id: 'nyc', title: 'NYC Trip', photoCount: 18, cover: photos.mixerShelves },
];

export const gallerySections: GallerySection[] = [
  {
    id: 'chicken-bubbly',
    place: 'Chicken Bubbly -- Oakland, Pittsburgh',
    photos: [
      photos.dessertCups,
      photos.bubbleTea,
      photos.plushFriend,
      { ...photos.noodleSoup, crop: { height: '145.45%', top: '-45.41%' } },
    ],
  },
  {
    id: 'heytea',
    place: 'HeyTea -- Cambridge, Boston',
    photos: [
      { ...photos.plushShop, crop: tallCrop('-28.51%') },
      { ...photos.cafeBrunch, crop: tallCrop('-38.19%') },
      photos.purpleLounge,
      photos.mixerShelves,
    ],
  },
];

export const highlights: Highlight[] = [
  {
    id: 'annie-aespa',
    friendId: 'annie',
    tag: 'aespa',
    date: '9.30.2026',
    photo: { ...photos.aespaConcert, crop: { height: '207.02%', top: '-74.87%' } },
  },
  {
    id: 'alicia-pottery',
    friendId: 'alicia',
    tag: 'Pottery',
    date: '9.30.2026',
    photo: { ...photos.pottery, crop: { height: '207.02%', top: '-90.78%' } },
  },
];

export const loggedDayShading = [18, 19, 25, 26];

export const todaysLog: DayLog = {
  date: new Date(2026, 9, 5),
  location: 'Pittsburgh, Pennsylvania',
  stops: [
    { id: 'walk', name: 'Morning walk', time: '9:15 am', city: 'Pittsburgh', photoCount: 0, photo: photos.morningWalk },
    { id: 'cafe', name: 'Cafe', time: '10:30 am', city: 'Pittsburgh', photoCount: 1 },
  ],
  photos: [photos.bubbleTea],
  note: 'A slow morning walk, then a little pick-me-up at Cafe. The best kind of ordinary day.',
  audience: 'private',
};

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

export const linkedAccounts: LinkedAccount[] = [
  { id: 'google', name: 'Google', subtitle: 'Connected · Used for sign in', connected: true },
  { id: 'apple', name: 'Apple', subtitle: 'Not connected', connected: false },
  { id: 'instagram', name: 'Instagram', subtitle: 'Not connected · No posts shared', connected: false },
];
