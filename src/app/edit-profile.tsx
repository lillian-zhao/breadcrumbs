import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Avatar,
  Button,
  Caption,
  PageHeader,
  Pill,
  Screen,
  SectionHeading,
  StatusMessage,
  TextField,
} from '@/components/ui';
import { currentUser } from '@/data';

export default function EditProfile() {
  const [name, setName] = useState(currentUser.name);
  const [handle, setHandle] = useState(currentUser.handle);
  const [bio, setBio] = useState(currentUser.bio);

  return (
    <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
      <PageHeader
        back={{ label: 'Settings' }}
        title={{ title: 'A little you', fontSize: 44, lineHeight: 49.28 }}
        subtitle={`Edit profile · ${currentUser.name}`}
        style={styles.header}
      />

      <View style={styles.content}>
        <View style={styles.photoEditor}>
          <Avatar photo={currentUser.avatar} size={116} />
          <Pill
            label="Change profile photo"
            icon={require('@assets/icons/camera.svg')}
            tintIcons
            onPress={() => router.push('/edit-photo?from=profile' as Href)}
          />
        </View>

        <SectionHeading label="your profile" fontSize={19} ruleOpacity={0.6} />
        <TextField
          label="Name"
          value={name}
          onChangeText={setName}
          helper="Use 1–40 characters. This is the name friends will see."
        />
        <TextField
          label="Username"
          value={handle}
          onChangeText={setHandle}
          helper="Letters, numbers and underscores only. 3–20 characters."
        />
        <TextField
          label="Bio"
          value={bio}
          onChangeText={setBio}
          helper={`${bio.length} / 160 characters · A little introduction to your days.`}
          multiline
        />

        <StatusMessage
          icon={require('@assets/icons/check.svg')}
          title="Looking good"
          body="Your name and username meet the requirements. Your photo won’t change until you save."
        />
        <Caption>Change photo opens your photo picker. Cancel keeps your current profile exactly as it is.</Caption>

        <View style={styles.actions}>
          <Button label="Cancel" variant="secondary" fill onPress={() => router.back()} />
          <Button label="Save profile" fill onPress={() => router.back()} />
        </View>
        <Caption align="center">Saving returns to your Profile with “Profile updated”.</Caption>
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
  photoEditor: {
    alignItems: 'center',
    gap: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
});
