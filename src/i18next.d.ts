import { resources } from 'src/services/i18n/config'

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: (typeof resources)['en']
    returnNull: false
  }
}
