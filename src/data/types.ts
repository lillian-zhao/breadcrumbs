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
  /** null when the photo is missing or not yet uploaded. */
  source: ImageSource | null;
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

/** A friend with their crumb activity: total places and how many are from the last week. */
export type FriendActivity = {
  id: string;
  name: string;
  handle: string;
  avatar: Photo;
  places: number;
  newPlaces: number;
};

export type SavedPlace = {
  id: string;
  name: string;
  category: string;
  price: string;
  photo: Photo;
};

export type Album = {
  id: string;
  title: string;
  photoCount: number;
  cover: Photo;
};

export type GallerySection = {
  id: string;
  place: string;
  photos: Photo[];
};

export type Highlight = {
  id: string;
  friendId: string;
  friendName: string;
  tag: string;
  date: string;
  photo: Photo;
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
