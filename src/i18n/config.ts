import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import namespace files
import commonAr from './locales/common/ar.json';
import commonEn from './locales/common/en.json';
import homeAr from './locales/home/ar.json';
import homeEn from './locales/home/en.json';
import eventsAr from './locales/events/ar.json';
import eventsEn from './locales/events/en.json';
import resourcesAr from './locales/resources/ar.json';
import resourcesEn from './locales/resources/en.json';
import cmsAr from './locales/cms/ar.json';
import cmsEn from './locales/cms/en.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: {
        common: commonAr,
        home: homeAr,
        events: eventsAr,
        resources: resourcesAr,
        cms: cmsAr
      },
      en: {
        common: commonEn,
        home: homeEn,
        events: eventsEn,
        resources: resourcesEn,
        cms: cmsEn
      }
    },
    lng: 'ar', // default language (Arabic)
    fallbackLng: 'ar',
    defaultNS: 'common',
    ns: ['common', 'home', 'events', 'resources', 'cms'],
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
