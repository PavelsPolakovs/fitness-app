import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { lightTheme } from '@/constants/themes';

export default function WorkoutScreen() {
  const { t } = useTranslation();
  const theme = lightTheme;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.heading, { color: theme.colors.text }]}>{t('screens.workout')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
