import type { ImageSource } from 'expo-image';
import type { DimensionValue } from 'react-native';

/** Percent-based framing of a photo inside its slot, as exported from Figma. */
export type Crop = {
  height: DimensionValue;
  top: DimensionValue;
  width?: DimensionValue;
  left?: DimensionValue;
};

export type Photo = {
  source: ImageSource;
  crop?: Crop;
};

export type User = {
  id: string;
  name: string;
  handle: string;
  bio: string;
  avatar: Photo;
  daysLogged: number;
  followers: number;
  following: number;
};

export type Friend = {
  id: string;
  name: string;
  handle: string;
  bio: string;
  avatar: Photo;
};

export type NearbyPlace = {
  id: string;
  name: string;
  subtitle: string;
  detail?: string;
  status: 'selected' | 'added' | 'choose';
};

export type LinkedAccount = {
  id: string;
  name: string;
  subtitle: string;
  connected: boolean;
};

export type FriendWeek = {
  friendId: string;
  cover: Photo;
  places: number;
  newPlaces: number;
};

/** Someone you don't follow yet, reached through people you already follow. */
export type FriendOfFriend = {
  id: string;
  via: string[];
};

export type SavedPlace = {
  id: string;
  name: string;
  category: string;
  price: string;
  photo: Photo;
};

export type PlaceDetail = {
  id: string;
  name: string;
  city: string;
  category: string;
  photo: Photo;
  photos: Photo[];
  friendIds: string[];
  visits: { title: string; subtitle: string }[];
};

export type BlockedUser = {
  id: string;
  name: string;
  handle: string;
  initials: string;
  detail: string;
};

export type WeekHighlight = {
  title: string;
  subtitle: string;
  actionLabel: string;
  href: string;
};

export type Highlight = {
  id: string;
  friendId: string;
  tag: string;
  date: string;
  photo: Photo;
};

/** A friend’s shared stop, used by map pins and crumb detail. */
export type Crumb = {
  id: string;
  friendId: string;
  placeId: string;
  place: string;
  time: string;
  city: string;
  photo: Photo;
  note: string;
};

export type NearbyFriendPin = {
  friendId: string;
  crumbId: string;
  place: string;
  detail: string;
  left: number;
  top: number;
  labelLeft: number;
  labelTop: number;
};

export type Stop = {
  id: string;
  name: string;
  time: string;
  city: string;
  photoCount: number;
  photo?: Photo;
};

export type Audience = 'private' | 'friends';

export type DayLog = {
  date: Date;
  location: string;
  stops: Stop[];
  photos: Photo[];
  note: string;
  audience: Audience;
};
