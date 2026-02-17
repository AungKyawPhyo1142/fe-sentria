import AuthLayout from '@/components/auth/AuthLayout'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'
import { AppConstantRoutes } from '@/services/routes/path'
import { useEffect, useState } from 'react'
import CheckCircleAnimated from '@/components/CheckCircleAnimated'
import { XCircle } from 'lucide-react'
import { useVerifyEmail } from '@/services/network/lib/auth'

type VerifyEmailStatus = 'loading' | 'success' | 'error'

function VerifyEmail() {
  const { t } = useTranslation()
  const { token } = useParams()

  const [animationComplete, setAnimationComplete] = useState<boolean>(false)
  const [verificationStatus, setVerificationStatus] =
    useState<VerifyEmailStatus>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const animationDuration = 3000

  const { data, error, isLoading } = useVerifyEmail(token || '')

  useEffect(() => {
    if (isLoading) {
      setVerificationStatus('loading')
    } else if (error) {
      setVerificationStatus('error')
      setErrorMessage(
        error instanceof Error
          ? error.message
          : t('emailVerification.verificationFailed'),
      )
    } else if (data) {
      setVerificationStatus('success')
    }
  }, [isLoading, error, data, t])

  useEffect(() => {
    if (animationComplete) {
      const redirectTimer = setTimeout(() => {
        navigate(AppConstantRoutes.paths.onboarding.welcome)
      }, 1000)

      return () => clearTimeout(redirectTimer)
    }
  }, [animationComplete, navigate])

  return (
    <AuthLayout>
      <div className='flex flex-col items-center space-y-8 text-center'>
        {verificationStatus === 'loading' && (
          <>
            <div className='border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent' />
            <p className='text-primary text-sm'>
              {t('emailVerification.verifying')}
            </p>
          </>
        )}

        {verificationStatus === 'success' && (
          <>
            <CheckCircleAnimated
              setAnimationComplete={setAnimationComplete}
              animationDuration={animationDuration}
            />
            <h1 className='text-2xl font-semibold text-gray-900'>
              {t('emailVerification.verified')}
            </h1>
            {animationComplete && (
              <p className='animate-fade-in text-sm text-gray-500'>
                {t('emailVerification.redirecting')}
              </p>
            )}
          </>
        )}

        {verificationStatus === 'error' && (
          <>
            <div className='text-danger'>
              <XCircle size={64} strokeWidth={1} />
            </div>
            <h1 className='text-danger text-xl font-semibold'>
              {t('emailVerification.verificationFailed')}
            </h1>
            <p className='text-sm text-gray-700'>{errorMessage}</p>
          </>
        )}
      </div>
    </AuthLayout>
  )
}

export default VerifyEmail
