import Button from '@/components/common/Button'
import { MailCheck, RotateCw } from 'lucide-react'
import { useLocation } from 'react-router'
import axios from 'axios'
import { useTranslation, Trans } from 'react-i18next'
import { useState } from 'react'

// http://localhost:8080/auth/verify-email/sent?email=hello@gmail.com
function VerificationSent() {
  const { t } = useTranslation()
  const [isResending, setIsResending] = useState(false)
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const email = query.get('email') // Get email from query parameters

  const handleResend = () => {
    if (!email) {
      console.error('No email provided for resend action')
      return
    }
    const resendEmail = async () => {
      try {
        setIsResending(true)
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/resend-verification-email`,
          { email },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          },
        )

        if (response.status !== 200) {
          throw new Error('Network response was not ok')
        }

        console.log('Verification email resent successfully:', response.data)
        setIsResending(false)
      } catch (error) {
        console.error('Error resending verification email:', error)
        setIsResending(false)
      }
    }
    resendEmail()
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
          disabled={isResending}
          aria-busy={isResending}
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
