import { toast as sonnerToast, type ExternalToast } from 'sonner'

export const toast = {
  success(message: string, options?: ExternalToast) {
    return sonnerToast.success(message, options)
  },

  error(message: string, options?: ExternalToast) {
    return sonnerToast.error(message, options)
  },

  info(message: string, options?: ExternalToast) {
    return sonnerToast.info(message, options)
  },

  warning(message: string, options?: ExternalToast) {
    return sonnerToast.warning(message, options)
  },

  dismiss: sonnerToast.dismiss,
}
