import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { lightTheme } from '@/constants/themes';

import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const theme = lightTheme;
  const { signOut } = useAuth();

  const toggleLanguage = () => {
    const next = i18n.language === 'en' ? 'ru' : 'en';
    i18n.changeLanguage(next);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.heading, { color: theme.colors.text }]}>{t('screens.profile')}</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.accent }]}
        onPress={toggleLanguage}
      >
        <Text style={styles.buttonText}>
          {i18n.language === 'en' ? 'Switch to RU' : 'Switch to EN'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.signOutButton]} onPress={signOut}>
        <Text style={styles.buttonText}>{t('common.signOut')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  button: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  signOutButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
