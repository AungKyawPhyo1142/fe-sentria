import Button from '@/components/common/Button'
import { useResendEmail } from '@/services/network/lib/auth'
import { MailCheck, RotateCw } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'

// http://localhost:8080/auth/verify-email/sent?email=hello@gmail.com
function VerificationSent() {
  const { t } = useTranslation()
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const email = query.get('email')?.replace(/ /g, '+') // Get email from query parameters

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
    <>
      <div className='fade-in flex min-h-screen flex-col items-center justify-center space-y-10 bg-white p-4'>
        <div className='flex flex-col items-center justify-center space-y-5 px-4'>
          <MailCheck
            className='text-primary h-14 w-14'
            style={{ strokeWidth: 0.5 }}
          />
          <h1 className='text-2xl font-semibold text-black'>
            {t('emailVerification.sent')}
          </h1>

          <p className='text-center text-[14px] text-black'>
            <Trans
              i18nKey='emailVerification.emailSent'
              values={{ email: email || 'user@example.com' }}
              components={{ bold: <strong className='font-semibold' /> }}
            />
          </p>

          <p className='w-sm text-center text-[10px] font-light text-[#33333480]'>
            {t('emailVerification.confirmDescription')}
          </p>
        </div>

        <Button
          onClick={handleResend}
          disabled={resendMutation.isPending}
          aria-busy={resendMutation.isPending}
          className='h-13 w-51 bg-black px-3 py-3 text-[20px] text-white'
          type='button'
        >
          <div className='flex flex-row items-center justify-center space-x-2'>
            <RotateCw className='h-[18px] w-[18px]' />
            <span className='mr-2'>{t('emailVerification.resendEmail')}</span>
          </div>
        </Button>
      </div>
    </>
  )
}

export default VerificationSent
