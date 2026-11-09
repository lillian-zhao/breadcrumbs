import { router, useFocusEffect, useLocalSearchParams, type Href } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { formatLoggedDay, parseDayParam } from '@/components/calendar';
import { NoLogDay } from '@/components/NoLogDay';
import {
  Button,
  Card,
  ListRow,
  PageHeader,
  Photo,
  Pill,
  Screen,
  SectionHeading,
  TextField,
} from '@/components/ui';
import { createCrumb, useCurrentUser, useDayLog, type Audience, type Photo as PhotoData, type Stop } from '@/data';
import { clearPendingPhotos, getPendingPhotos, type PendingPhoto } from '@/lib/pending-photos';
import { colors, fonts } from '@/theme';

const audienceHelp: Record<Audience, string> = {
  private: 'Only you can see this day until you choose to share.',
  friends: 'Your friends can see this day and its photos.',
};

function stopDetail(stop: Stop) {
  const parts = [stop.time, stop.city];
  if (stop.photoCount > 0) parts.push(stop.photoCount + ' photo' + (stop.photoCount === 1 ? '' : 's'));
  return parts.join(' · ');
}

function FeaturedStop({ stop, photo }: { stop: Stop; photo: PhotoData }) {
  return (
    <View style={styles.stop}>
      <Photo photo={photo} style={styles.stopPhoto} />
      <View style={styles.stopDetails}>
        <Text style={styles.stopName}>{stop.name}</Text>
        <Text style={styles.caption}>{stopDetail(stop)}</Text>
      </View>
      <Pill label="Edit" accessibilityLabel={'Edit ' + stop.name} onPress={() => router.push('/edit-location?stop=' + stop.id as Href)} />
    </View>
  );
}

export default function LogDay() {
  const { date: dateParam } = useLocalSearchParams<{ date?: string }>();
  const date = parseDayParam(dateParam) ?? new Date();
  const fromCalendar = parseDayParam(dateParam) !== undefined;
  const { data: currentUser } = useCurrentUser();
  const { data: dayLog, loading } = useDayLog(date);

  const logged = dayLog != null;
  const isNew = fromCalendar && !logged && !loading;
  const [composing, setComposing] = useState(false);
  const [noteEdit, setNoteEdit] = useState<string>();
  const [audienceEdit, setAudienceEdit] = useState<Audience>();
  const [saving, setSaving] = useState(false);
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([]);

  useFocusEffect(
    useCallback(() => {
      setPendingPhotos(getPendingPhotos());
    }, []),
  );

  useEffect(
    () => () => {
      clearPendingPhotos();
    },
    [],
  );

  const note = noteEdit ?? dayLog?.note ?? '';
  const audience = audienceEdit ?? dayLog?.audience ?? 'private';
  const stops = dayLog?.stops ?? [];
  const [featured, ...otherStops] = stops;
  const photos = dayLog?.photos ?? [];
  const allPhotos: PhotoData[] = [...photos, ...pendingPhotos.map((p) => ({ source: { uri: p.uri } }))];
  const location = dayLog?.location ?? '';
  const dayLabel = formatLoggedDay(date);

  const save = async () => {
    setSaving(true);
    try {
      await createCrumb({
        placeName: featured?.name ?? 'A little stop',
        city: location || 'Pittsburgh',
        visitedAt: date,
        note: note.trim() ? note.trim() : null,
        audience,
        photoIds: pendingPhotos.map((p) => p.photoId),
      });
      clearPendingPhotos();
      setPendingPhotos([]);
      router.back();
    } catch (error) {
      console.warn(error);
    } finally {
      setSaving(false);
    }
  };

  if (isNew && !composing) {
    return (
      <NoLogDay date={date} backLabel="Calendar" ownerName={currentUser?.name ?? 'You'} onCompose={() => setComposing(true)} />
    );
  }

  return (
    <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
      <PageHeader
        back={{
          label: fromCalendar ? 'Calendar' : 'Home',
          icon: require('@assets/icons/arrow-return.svg'),
          iconSize: 15.27,
          iconStyle: styles.returnIcon,
        }}
        title={{ title: 'Log a Day', fontSize: 44, lineHeight: 49.28 }}
        subtitle={(currentUser?.name ?? 'You') + '’s crumbs · ' + dayLabel}
        style={styles.header}
      />

      <View style={styles.content}>
        <ListRow
          icon={require('@assets/icons/calendar-row.svg')}
          title={dayLabel}
          subtitle={logged ? location : 'A new crumb for this date'}
          actionLabel="Change"
          onAction={() => {}}
        />

        <SectionHeading label="today’s stops" fontSize={19} ruleOpacity={0.6} />
        {stops.length === 0 ? (
          <Card>
            <Text style={styles.caption}>No stops yet. Add a location to start your trail.</Text>
          </Card>
        ) : (
          <Card>
            {featured && featured.photo && <FeaturedStop stop={featured} photo={featured.photo} />}
            {otherStops.map((stop) => (
              <ListRow
                key={stop.id}
                icon={require('@assets/icons/map-pin-row.svg')}
                title={stop.name}
                subtitle={stopDetail(stop)}
                actionLabel="Edit"
                onAction={() => router.push('/edit-location?stop=' + stop.id as Href)}
              />
            ))}
          </Card>
        )}

        <Button
          label="Add location"
          variant="secondary"
          icon={require('@assets/icons/plus.svg')}
          onPress={() => router.push('/choose-location')}
        />

        <SectionHeading label="little moments" fontSize={19} ruleOpacity={0.6} />
        {allPhotos.length === 0 ? (
          <Button
            label="Add photo"
            variant="secondary"
            icon={require('@assets/icons/camera.svg')}
            onPress={() => router.push('/edit-photo' as Href)}
          />
        ) : (
          <View style={styles.moments}>
            <Photo photo={allPhotos[0]} style={styles.momentPhoto} />
            <View style={styles.photoAction}>
              <Button
                label="Add photo"
                variant="secondary"
                icon={require('@assets/icons/camera.svg')}
                onPress={() => router.push('/edit-photo' as Href)}
              />
              <Text style={styles.caption}>
                {allPhotos.length} photo{allPhotos.length === 1 ? '' : 's'} attached · Preview to edit
              </Text>
            </View>
          </View>
        )}

        <TextField
          label="A note for this day"
          value={note}
          onChangeText={setNoteEdit}
          placeholder="What made today worth remembering?"
          helper="Your note stays with this day."
          multiline
        />

        <SectionHeading label="who can see this?" fontSize={19} ruleOpacity={0.6} />
        <View style={styles.audience}>
          <Pill
            label="Only me"
            icon={require('@assets/icons/lock.svg')}
            tintIcons
            tone={audience === 'private' ? 'selected' : 'default'}
            onPress={() => setAudienceEdit('private')}
          />
          <Pill
            label="Friends"
            icon={require('@assets/icons/users.svg')}
            tintIcons
            tone={audience === 'friends' ? 'selected' : 'default'}
            onPress={() => setAudienceEdit('friends')}
          />
        </View>
        <Text style={styles.caption}>{audienceHelp[audience]}</Text>

        <View style={styles.actions}>
          <Button label="Cancel" variant="secondary" fill onPress={() => { clearPendingPhotos(); router.back(); }} />
          <Button label={saving ? 'Saving…' : 'Save day'} fill onPress={saving ? undefined : save} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
  },
  returnIcon: {
    marginLeft: -1.27,
    marginRight: -1.27,
    marginVertical: -0.64,
  },
  content: {
    gap: 22,
  },
  stop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stopPhoto: {
    width: 64,
    height: 64,
  },
  stopDetails: {
    flex: 1,
    gap: 5,
  },
  stopName: {
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 23.6,
    color: colors.ink,
  },
  caption: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17.4,
    color: colors.caption,
  },
  moments: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  momentPhoto: {
    width: 172,
    height: 132,
  },
  photoAction: {
    flex: 1,
    gap: 10,
  },
  audience: {
    flexDirection: 'row',
    gap: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
});
