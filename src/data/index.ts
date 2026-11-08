import type {
  BlockedUser,
  Crop,
  DayLog,
  Friend,
  FriendOfFriend,
  Crumb,
  FriendWeek,
  Highlight,
  LinkedAccount,
  NearbyFriendPin,
  NearbyPlace,
  Photo,
  PlaceDetail,
  SavedPlace,
  User,
  WeekHighlight,
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

export const suggestedPeople: Friend[] = [
  {
    id: 'jordan',
    name: 'Jordan',
    handle: '@jordan',
    bio: 'Always one more bakery on the walk home.',
    avatar: photos.aespaConcert,
  },
  {
    id: 'priya',
    name: 'Priya',
    handle: '@priya',
    bio: 'Clay dust and weekend markets.',
    avatar: photos.pottery,
  },
];

export const people: Friend[] = [...friends, ...suggestedPeople];

export function getPerson(id: string) {
  return people.find((candidate) => candidate.id === id);
}

export const followerIds = ['annie', 'alicia', 'maggie'];
export const initialFollowingIds = ['annie', 'alicia', 'maggie'];

export const friendsOfFriends: FriendOfFriend[] = [
  { id: 'tongtong', via: ['annie'] },
  { id: 'jordan', via: ['alicia'] },
  { id: 'priya', via: ['maggie'] },
];

export function matchesPersonQuery(person: Pick<Friend, 'name' | 'handle' | 'bio'>, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [person.name, person.handle, person.bio].some((value) => value.toLowerCase().includes(needle));
}

export function mutualLabel(via: string[]) {
  const names = via.map((id) => getPerson(id)?.name ?? id);
  if (names.length === 0) return 'Someone you may know';
  if (names.length === 1) return `Friends with ${names[0]}`;
  if (names.length === 2) return `Friends with ${names[0]} and ${names[1]}`;
  return `Friends with ${names[0]} and ${names.length - 1} others`;
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

export const weeklyHighlights: WeekHighlight[] = [
  {
    title: 'A morning at Cafe',
    subtitle: 'Sep 30 · Your journal and 3 little moments',
    actionLabel: 'View day',
    href: '/log-day',
  },
  {
    title: 'A sweet little pause',
    subtitle: 'Oct 2 · A photo worth keeping',
    actionLabel: 'View photo',
    href: '/place/heytea',
  },
];

export const places: PlaceDetail[] = [
  {
    id: 'heytea',
    name: 'HeyTea',
    city: 'Cambridge, Boston',
    category: 'Tea',
    photo: { ...photos.plushShop, crop: tallCrop('-28.51%') },
    photos: [
      { ...photos.plushShop, crop: tallCrop('-28.51%') },
      { ...photos.cafeBrunch, crop: tallCrop('-38.19%') },
      photos.purpleLounge,
      photos.mixerShelves,
    ],
    friendIds: ['annie', 'alicia', 'maggie'],
    visits: [
      { title: 'A shared Saturday', subtitle: 'Oct 2 · You and Annie' },
      { title: 'First visit', subtitle: 'Sep 14 · Logged in your journal' },
    ],
  },
  {
    id: 'bistro',
    name: 'The Bistro',
    city: 'Pittsburgh',
    category: 'Italian',
    photo: photos.purpleLounge,
    photos: [photos.purpleLounge, photos.mixerShelves, photos.noodleSoup, photos.dessertCups],
    friendIds: ['annie', 'tongtong'],
    visits: [{ title: 'Dinner for two', subtitle: 'Sep 28 · Your journal' }],
  },
  {
    id: 'park-cafe',
    name: 'Park Café',
    city: 'Pittsburgh',
    category: 'Coffee',
    photo: photos.cafeBrunch,
    photos: [photos.cafeBrunch, photos.bubbleTea, photos.morningWalk, photos.dessertCups],
    friendIds: ['alicia', 'maggie'],
    visits: [{ title: 'A morning at Cafe', subtitle: 'Sep 30 · 3 little moments' }],
  },
  {
    id: 'rooftop',
    name: 'Rooftop Bar',
    city: 'Pittsburgh',
    category: 'Bar',
    photo: photos.mixerShelves,
    photos: [photos.mixerShelves, photos.purpleLounge, photos.plushFriend, photos.aespaConcert],
    friendIds: ['tongtong'],
    visits: [{ title: 'Late lights', subtitle: 'Oct 3 · Photos worth keeping' }],
  },
];

export function getPlace(id: string) {
  return places.find((place) => place.id === id);
}

export const blockedUsers: BlockedUser[] = [
  { id: 'alex', name: 'Alex M.', handle: '@alexm', initials: 'AM', detail: 'Blocked · Oct 2, 2026' },
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

export const crumbs: Crumb[] = [
  {
    id: 'annie-aespa',
    friendId: 'annie',
    placeId: 'rooftop',
    place: 'Rooftop Bar',
    time: '8:40 pm',
    city: 'Pittsburgh',
    photo: highlights[0].photo,
    note: 'A loud, glittering night. She kept this crumb for friends.',
  },
  {
    id: 'alicia-pottery',
    friendId: 'alicia',
    placeId: 'heytea',
    place: 'HeyTea',
    time: '2:15 pm',
    city: 'Cambridge',
    photo: highlights[1].photo,
    note: 'Clay on her hands, tea on the table. A slow shared afternoon.',
  },
  {
    id: 'alicia-park',
    friendId: 'alicia',
    placeId: 'park-cafe',
    place: 'Park Café',
    time: '10:12 am',
    city: 'Pittsburgh',
    photo: photos.cafeBrunch,
    note: 'A late breakfast and a little walk through the park.',
  },
  {
    id: 'maggie-rooftop',
    friendId: 'maggie',
    placeId: 'rooftop',
    place: 'Rooftop Bar',
    time: '7:05 pm',
    city: 'Pittsburgh',
    photo: photos.mixerShelves,
    note: 'Lights coming on over the river. She saved the shelf, too.',
  },
];

export function getCrumb(id: string) {
  return crumbs.find((crumb) => crumb.id === id);
}

export function getCrumbsForFriend(friendId: string) {
  return crumbs.filter((crumb) => crumb.friendId === friendId);
}

export const nearbyFriendPins: NearbyFriendPin[] = [
  {
    friendId: 'annie',
    crumbId: 'annie-aespa',
    place: 'Cafe',
    detail: 'now · 0.2 mi',
    left: 230,
    top: 266,
    labelLeft: 251,
    labelTop: 218,
  },
  {
    friendId: 'alicia',
    crumbId: 'alicia-park',
    place: 'Park Café',
    detail: '12 min ago',
    left: 66,
    top: 180,
    labelLeft: 118,
    labelTop: 132,
  },
  {
    friendId: 'maggie',
    crumbId: 'maggie-rooftop',
    place: 'Rooftop Bar',
    detail: '1 hr ago',
    left: 278,
    top: 88,
    labelLeft: 198,
    labelTop: 42,
  },
];

/** Days logged in `today`'s year, keyed by person then 0-based month. */
export const loggedDaysByPerson: Record<string, Partial<Record<number, number[]>>> = {
  lillian: {
    0: [5, 12],
    1: [14],
    2: [3, 22],
    3: [8],
    4: [1, 17],
    5: [2, 9, 21],
    6: [4, 19],
    7: [11, 16, 30],
    8: [7, 14, 28],
    9: [18, 19, 25, 26],
    10: [2],
    11: [24, 25],
  },
  annie: {
    5: [2, 21],
    7: [16],
    8: [14],
    9: [2, 11, 18],
  },
  alicia: {
    8: [30],
    9: [11, 19],
  },
  tongtong: {
    9: [3],
  },
  maggie: {
    7: [11, 30],
    9: [18, 25],
  },
};

export const loggedDayShading = loggedDaysByPerson.lillian[today.getMonth()] ?? [];

export function getShadedDays(personId: string, year: number, month: number) {
  if (year !== today.getFullYear()) return [];
  return loggedDaysByPerson[personId]?.[month] ?? [];
}

export function hasLoggedDay(personId: string, date: Date) {
  return getShadedDays(personId, date.getFullYear(), date.getMonth()).includes(date.getDate());
}

export function getShadedDaysByMonth(personId: string, year: number): Partial<Record<number, number[]>> {
  if (year !== today.getFullYear()) return {};
  return loggedDaysByPerson[personId] ?? {};
}

export function countLoggedDays(personId: string, year: number) {
  return Object.values(getShadedDaysByMonth(personId, year)).reduce((total, days) => total + (days?.length ?? 0), 0);
}

export function getSharedPlaces(personId: string) {
  if (personId === currentUser.id) return savedPlaces;
  return savedPlaces.slice(0, personId === 'tongtong' ? 1 : 2);
}

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
