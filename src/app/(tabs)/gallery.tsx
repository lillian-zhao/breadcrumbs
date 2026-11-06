import { Image } from 'expo-image';
import { Fragment, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Divider, HeroTitle, Photo, PhotoCard, Pill, Screen, SearchField, SegmentedControl } from '@/components/ui';
import { useAlbums, useGallerySections } from '@/data';
import { colors, fonts } from '@/theme';

type GalleryView = 'photos' | 'albums';
type GalleryFilter = 'location' | 'date' | 'recent';

export default function Gallery() {
  const [view, setView] = useState<GalleryView>('photos');
  const [filter, setFilter] = useState<GalleryFilter>('location');
  const [query, setQuery] = useState('');
  const { data: albums = [] } = useAlbums();
  const { data: gallerySections = [] } = useGallerySections();

  const filterTone = (value: GalleryFilter) => (filter === value ? 'selected' : 'muted');

  return (
    <Screen topOffset={20} paddingHorizontal={24}>
      <View style={styles.header}>
        <HeroTitle title="Gallery" height={90} ornamentsLeft={247} />
        <SegmentedControl
          segments={[
            { value: 'photos', label: 'Photos' },
            { value: 'albums', label: 'Albums' },
          ]}
          value={view}
          onChange={setView}
        />
      </View>

      <View style={styles.body}>
        <SearchField value={query} onChangeText={setQuery} placeholder="search places, dishes…" />

        <View style={styles.filters}>
          <Pill
            label="Location"
            size="chip"
            tone={filterTone('location')}
            icon={require('@assets/icons/map-pin-chip.svg')}
            trailingIcon={require('@assets/icons/chevron-down.svg')}
            tintIcons
            onPress={() => setFilter('location')}
          />
          <Pill
            label="Date"
            size="chip"
            tone={filterTone('date')}
            icon={require('@assets/icons/calendar.svg')}
            trailingIcon={require('@assets/icons/chevron-down.svg')}
            tintIcons
            onPress={() => setFilter('date')}
          />
          <Pill
            label="Most Recent"
            size="chip"
            tone={filterTone('recent')}
            icon={require('@assets/icons/sliders.svg')}
            tintIcons
            onPress={() => setFilter('recent')}
          />
        </View>

        {view === 'albums' ? (
          <View style={styles.photoGrid}>
            {albums.map((album) => (
              <PhotoCard
                key={album.id}
                variant="stacked"
                photo={album.cover}
                title={album.title}
                subtitle={`${album.photoCount} photos`}
                size={{ width: 168, height: 153, photoHeight: 100 }}
              />
            ))}
          </View>
        ) : (
          gallerySections.map((section, index) => (
            <Fragment key={section.id}>
              {index > 0 && <Divider />}
              <View style={styles.placeLabel}>
                <Image source={require('@assets/icons/map-pin-label.svg')} style={styles.icon14} />
                <Text style={styles.placeName}>{section.place}</Text>
                <Text style={styles.photoCount}>· {section.photos.length} photos</Text>
              </View>
              <View style={styles.photoGrid}>
                {section.photos.map((photo, photoIndex) => (
                  <Photo key={photoIndex} photo={photo} style={styles.photo} />
                ))}
              </View>
            </Fragment>
          ))
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 12,
    paddingBottom: 24,
  },
  body: {
    gap: 18,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
  },
  icon14: {
    width: 14,
    height: 14,
  },
  placeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  placeName: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.crumb,
  },
  photoCount: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.muted,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 18,
    columnGap: 8,
  },
  photo: {
    width: 168,
    height: 148,
  },
});
