import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Caption, PageHeader, Photo, Pill, Screen, SectionHeading, TextField } from '@/components/ui';
import { currentUser, todaysLog } from '@/data';

type Tool = 'crop' | 'rotate';

export default function EditPhoto() {
  const { from: fromParam } = useLocalSearchParams<{ from?: string }>();
  const fromProfile = (Array.isArray(fromParam) ? fromParam[0] : fromParam) === 'profile';
  const photo = fromProfile ? currentUser.avatar : todaysLog.photos[0];
  const [caption, setCaption] = useState(fromProfile ? '' : 'A little pause at Cafe.');
  const [tool, setTool] = useState<Tool>('crop');

  return (
    <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
      <PageHeader
        back={{ label: fromProfile ? 'Profile' : 'Log a Day' }}
        title={{ title: 'Edit this photo.', fontSize: 44, lineHeight: 49.28 }}
        subtitle={fromProfile ? 'Profile photo · Preview before saving' : 'A crumb from today · Preview to crop'}
        style={styles.header}
      />

      <View style={styles.content}>
        <Photo photo={photo} style={styles.hero} />

        <View style={styles.tools}>
          <Pill
            label="Crop"
            tone={tool === 'crop' ? 'selected' : 'default'}
            onPress={() => setTool('crop')}
          />
          <Pill
            label="Rotate"
            tone={tool === 'rotate' ? 'selected' : 'default'}
            onPress={() => setTool('rotate')}
          />
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
          <Button label={fromProfile ? 'Save photo' : 'Save to day'} fill onPress={() => router.back()} />
        </View>
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
  tools: {
    flexDirection: 'row',
    gap: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
});
