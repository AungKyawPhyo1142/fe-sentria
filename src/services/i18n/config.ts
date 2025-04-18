import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import commonEN from '@/services/i18n/en/common.json'
import errorEN from '@/services/i18n/en/error.json'
import commonMM from '@/services/i18n/mm/common.json'
import errorMM from '@/services/i18n/mm/error.json'
import { config } from '../../../config/register'

export const resources = {
  en: {
    translation: {
      ...commonEN,
      ...errorEN,
    },
  },
  mm: {
    translation: {
      ...commonMM,
      ...errorMM,
    },
  },
}

i18next.use(initReactI18next).init({
  lng: config.lang,
  fallbackLng: 'en',
  resources,
  returnNull: false,
  interpolation: {
    escapeValue: false,
  },
})
