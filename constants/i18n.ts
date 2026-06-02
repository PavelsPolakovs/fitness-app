import { initReactI18next } from 'react-i18next';
import { NativeModules, Platform } from 'react-native';

import en from '@/constants/locales/en.json';
import ru from '@/constants/locales/ru.json';

import i18n from 'i18next';

const deviceLocale: string =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager?.settings?.AppleLocale ||
      NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ||
      'en'
    : NativeModules.I18nManager?.localeIdentifier || 'en';

const languageCode = deviceLocale.split('_')[0].split('-')[0];

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
  },
  lng: languageCode,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
