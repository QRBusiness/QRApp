import translationEN from '@/assets/lang/en/translation.json';
import translationVI from '@/assets/lang/vi/translation.json';
import { LANGUAGE_STORAGE } from '@/constants';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { loadFromLocalStorage } from '@/libs/utils';

const STORAGE_LANG = loadFromLocalStorage(LANGUAGE_STORAGE, 'en');

const resources = {
  en: {
    translation: translationEN,
  },
  vi: {
    translation: translationVI,
  },
};

i18next.use(initReactI18next).init({
  resources,
  lng: STORAGE_LANG, // Default language
  debug: false, //Debug mode for development
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
