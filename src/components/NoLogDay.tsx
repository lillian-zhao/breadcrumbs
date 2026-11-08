import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { formatLoggedDay } from '@/components/calendar';
import { Button, Caption, Card, ListRow, PageHeader, Screen, SectionHeading, StatusMessage } from '@/components/ui';

type Props = {
  date: Date;
  backLabel?: string;
  ownerName: string;
  /** When set, this is your empty day and you can start a log. */
  onCompose?: () => void;
};

/** Empty journal for a calendar day that has no crumbs yet. */
export function NoLogDay({ date, backLabel = 'Calendar', ownerName, onCompose }: Props) {
  const day = formatLoggedDay(date);
  const yours = onCompose !== undefined;

  return (
    <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
      <PageHeader
        back={{ label: backLabel }}
        title={{ title: 'No log.', fontSize: 44, lineHeight: 49.28 }}
        subtitle={day}
        style={styles.header}
      />

      <View style={styles.content}>
        <ListRow
          icon={require('@assets/icons/calendar-row.svg')}
          title={day}
          subtitle={yours ? 'Nothing kept for this date yet' : `${ownerName} didn’t share a crumb this day`}
        />

        <StatusMessage
          icon={require('@assets/icons/info.svg')}
          title="No log"
          body={
            yours
              ? `You haven’t kept a crumb for ${day}. Start a log to pin places, photos and a note to this date.`
              : `${ownerName} has no shared crumb for ${day}. Private days stay off this page.`
          }
        />

        <SectionHeading label="today’s stops" fontSize={19} ruleOpacity={0.6} />
        <Card>
          <Caption>{yours ? 'No stops yet. Add the first place when you log this day.' : 'No shared stops for this day.'}</Caption>
        </Card>

        {yours ? (
          <>
            <Button label="Log this day" onPress={onCompose} />
            <Button label="Back to calendar" variant="secondary" onPress={() => router.back()} />
          </>
        ) : (
          <Button label={`Back to ${ownerName}`} variant="secondary" onPress={() => router.back()} />
        )}
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
});
