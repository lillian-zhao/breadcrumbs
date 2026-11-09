import { router, useFocusEffect, useLocalSearchParams, type Href } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { formatLoggedDay, parseDayParam, toDayParam } from '@/components/calendar';
import { Button, Caption, Card, PageHeader, Photo, Pill, Screen, SectionHeading, TextField } from '@/components/ui';
import { createCrumb, type Audience, type Photo as PhotoData } from '@/data';
import { clearPendingPhotos, getPendingPhotos, type PendingPhoto } from '@/lib/pending-photos';
import { clearPendingLocation, getPendingLocation, type PendingLocation } from '@/lib/pending-location';
import { fonts } from '@/theme';

const audienceHelp: Record<Audience, string> = {
  private: 'Only you can see this crumb until you choose to share it.',
  friends: 'Your friends can see this crumb and its photos.',
};

export default function AddCrumb() {
  const { date: dateParam } = useLocalSearchParams<{ date?: string }>();
  const date = parseDayParam(dateParam) ?? new Date();
  const [location, setLocation] = useState<PendingLocation | null>(null);
  const [photos, setPhotos] = useState<PendingPhoto[]>([]);
  const [note, setNote] = useState('');
  const [audience, setAudience] = useState<Audience>('private');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    clearPendingLocation();
    clearPendingPhotos();
    return () => {
      clearPendingLocation();
      clearPendingPhotos();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLocation(getPendingLocation());
      setPhotos(getPendingPhotos());
    }, []),
  );

  const save = async () => {
    if (!location) {
      setError('Choose a location before saving this crumb.');
      return;
    }
    setSaving(true);
    setError(undefined);
    try {
      await createCrumb({
        placeName: location.placeName,
        city: location.city,
        visitedAt: location.visitedAt,
        latitude: location.latitude,
        longitude: location.longitude,
        note: note.trim() || null,
        audience,
        photoIds: photos.map((photo) => photo.photoId),
      });
      router.back();
    } catch (reason) {
      console.warn(reason);
      setError(reason instanceof Error ? reason.message : 'Could not save this crumb. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const photoPreviews: PhotoData[] = photos.map((photo) => ({ source: { uri: photo.uri } }));

  return (
    <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
      <PageHeader
        back={{ label: 'Today’s crumbs' }}
        title={{ title: 'Add a crumb.', fontSize: 44, lineHeight: 49.28 }}
        subtitle={formatLoggedDay(date)}
        style={styles.header}
      />

      <View style={styles.content}>
        <SectionHeading label="location" fontSize={19} ruleOpacity={0.6} />
        {location ? (
          <Card>
            <Text style={styles.location}>{location.placeName}</Text>
            <Caption>{location.city}</Caption>
          </Card>
        ) : (
          <Caption>Choose the place for this crumb.</Caption>
        )}
        <Button
          label={location ? 'Change location' : 'Add location'}
          variant="secondary"
          onPress={() => router.push(('/choose-location?date=' + toDayParam(date)) as Href)}
        />

        <SectionHeading label="photos" fontSize={19} ruleOpacity={0.6} />
        {photoPreviews.length > 0 && (
          <View style={styles.photos}>
            {photoPreviews.map((photo, index) => <Photo key={index} photo={photo} style={styles.photo} />)}
          </View>
        )}
        {photos.length === 0 && <Caption>No photo selected.</Caption>}
        <Button
          label={photos.length ? 'Add another photo' : 'Add photo'}
          variant="secondary"
          onPress={() => router.push('/edit-photo?from=crumb')}
        />
        {photos.length > 0 && <Caption>{photos.length} photo{photos.length === 1 ? '' : 's'} attached to this crumb.</Caption>}

        <TextField
          label="A note"
          value={note}
          onChangeText={setNote}
          placeholder="What do you want to remember?"
          helper="Your note stays with this crumb."
          multiline
        />

        <SectionHeading label="who can see this?" fontSize={19} ruleOpacity={0.6} />
        <View style={styles.audience}>
          <Pill
            label="Only me"
            icon={require('@assets/icons/lock.svg')}
            tintIcons
            tone={audience === 'private' ? 'selected' : 'default'}
            onPress={() => setAudience('private')}
          />
          <Pill
            label="Friends"
            icon={require('@assets/icons/users.svg')}
            tintIcons
            tone={audience === 'friends' ? 'selected' : 'default'}
            onPress={() => setAudience('friends')}
          />
        </View>
        <Caption>{audienceHelp[audience]}</Caption>

        <View style={styles.actions}>
          <Button
            label="Cancel"
            variant="secondary"
            fill
            onPress={() => {
              clearPendingLocation();
              clearPendingPhotos();
              router.back();
            }}
          />
          <Button label={saving ? 'Saving…' : 'Save crumb'} fill onPress={saving ? undefined : save} />
        </View>
        {error ? <Caption>{error}</Caption> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 24 },
  content: { gap: 20 },
  location: { fontFamily: fonts.bodySemiBold, fontSize: 17 },
  photos: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  photo: { width: 96, height: 96 },
  audience: { flexDirection: 'row', gap: 8 },
  actions: { flexDirection: 'row', gap: 10 },
});
