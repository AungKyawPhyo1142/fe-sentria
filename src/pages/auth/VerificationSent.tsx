import Button from '@/components/common/Button'
import AuthLayout from '@/components/auth/AuthLayout'
import { useResendEmail } from '@/services/network/lib/auth'
import { MailCheck, RotateCw } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'

function VerificationSent() {
  const { t } = useTranslation()
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const email = query.get('email')?.replace(/ /g, '+')

  const resendMutation = useResendEmail()

  const handleResend = () => {
    if (!email) {
      console.error('No email provided for resend action')
      return
    }

    console.log('Resending verification email to:', email)

    resendMutation.mutate(email)
  }

  return (
    <AuthLayout>
      <div className='flex flex-col items-center space-y-6 text-center'>
        <MailCheck
          className='text-primary h-14 w-14'
          style={{ strokeWidth: 0.5 }}
        />
        <h1 className='text-2xl font-semibold text-gray-900'>
          {t('emailVerification.sent')}
        </h1>

        <p className='text-sm text-gray-700'>
          <Trans
            i18nKey='emailVerification.emailSent'
            values={{ email: email || 'user@example.com' }}
            components={{ bold: <strong className='font-semibold' /> }}
          />
        </p>

        <p className='text-xs text-gray-500'>
          {t('emailVerification.confirmDescription')}
        </p>

        <Button
          onClick={handleResend}
          disabled={resendMutation.isPending}
          aria-busy={resendMutation.isPending}
          variant='primary'
          size='lg'
          className='w-full'
          type='button'
        >
          <div className='flex items-center justify-center gap-2'>
            <RotateCw className='h-4 w-4' />
            <span>{t('emailVerification.resendEmail')}</span>
          </div>
        </Button>
      </div>
    </AuthLayout>
  )
}

export default VerificationSent
