import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Caption, Card, PageHeader, Photo, Pill, Screen, SectionHeading, TextField } from '@/components/ui';
import { emptyPhoto, updateProfile, useCurrentUser } from '@/data';
import { pickImageFromLibrary } from '@/lib/image-picker';
import { addPendingPhoto } from '@/lib/pending-photos';
import { uploadPhoto } from '@/lib/upload';

type Tool = 'crop' | 'rotate';

export default function EditPhoto() {
  const { from: fromParam } = useLocalSearchParams<{ from?: string }>();
  const fromProfile = (Array.isArray(fromParam) ? fromParam[0] : fromParam) === 'profile';
  const { data: currentUser } = useCurrentUser();
  const [pickedUri, setPickedUri] = useState<string>();
  const [picking, setPicking] = useState(false);
  const [saveError, setSaveError] = useState<string>();
  const photo = pickedUri
    ? { source: { uri: pickedUri } }
    : fromProfile
      ? currentUser?.avatar ?? emptyPhoto
      : emptyPhoto;
  const hasOriginalPhoto = fromProfile && currentUser?.avatar.source != null;
  const [caption, setCaption] = useState(fromProfile ? '' : 'A little pause at Cafe.');
  const [tool, setTool] = useState<Tool>('crop');

  const replacePhoto = async () => {
    setPicking(true);
    try {
      const picked = await pickImageFromLibrary();
      if (picked) setPickedUri(picked.uri);
    } finally {
      setPicking(false);
    }
  };

  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!pickedUri) {
      router.back();
      return;
    }
    setSaving(true);
    setSaveError(undefined);
    try {
      const { photoId, storagePath } = await uploadPhoto(pickedUri);
      if (fromProfile) await updateProfile({ avatarPath: storagePath });
      else addPendingPhoto(photoId, pickedUri);
      router.back();
    } catch (error) {
      console.warn(error);
      setSaveError(error instanceof Error ? error.message : 'Could not save this photo. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
      <PageHeader
        back={{ label: fromProfile ? 'Profile' : 'Add a Crumb' }}
        title={{ title: 'Edit this photo.', fontSize: 44, lineHeight: 49.28 }}
        subtitle={fromProfile ? 'Profile photo · Preview before saving' : 'A crumb from today · Preview to crop'}
        style={styles.header}
      />

      <View style={styles.content}>
        {pickedUri || hasOriginalPhoto ? (
          <Photo photo={photo} style={styles.hero} />
        ) : (
          <Card style={styles.placeholder}>
            <Caption align="center">No photo selected</Caption>
          </Card>
        )}

        <Pill
          label={picking ? 'Opening library…' : 'Replace photo'}
          icon={require('@assets/icons/camera.svg')}
          tintIcons
          onPress={picking ? undefined : replacePhoto}
        />

        <View style={styles.tools}>
          <Pill label="Crop" tone={tool === 'crop' ? 'selected' : 'default'} onPress={() => setTool('crop')} />
          <Pill label="Rotate" tone={tool === 'rotate' ? 'selected' : 'default'} onPress={() => setTool('rotate')} />
        </View>
        <Caption>
          {tool === 'crop'
            ? 'Drag inside the frame to reframe. The original photo stays in your library.'
            : 'Rotate turns the photo in place. Save to keep this version with the crumb.'}
        </Caption>

        {!fromProfile && (
          <>
            <SectionHeading label="a little caption" fontSize={19} ruleOpacity={0.6} />
            <TextField
              label="Caption"
              value={caption}
              onChangeText={setCaption}
              placeholder="What should this photo remember?"
              helper="Captions stay with this photo on the day you logged."
              multiline
            />
          </>
        )}

        <View style={styles.actions}>
          <Button label="Cancel" variant="secondary" fill onPress={() => router.back()} />
          <Button label={saving ? 'Saving…' : fromProfile ? 'Save photo' : 'Save to day'} fill onPress={saving ? undefined : save} />
        </View>
        {saveError ? <Caption>{saveError}</Caption> : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
  },
  content: {
    gap: 22,
  },
  hero: {
    height: 320,
  },
  placeholder: {
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tools: {
    flexDirection: 'row',
    gap: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
});
