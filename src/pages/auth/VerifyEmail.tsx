import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'
import axios from 'axios'
import { AppConstantRoutes } from '@/services/routes/path'
import { useEffect, useState } from 'react'
import CheckCircleAnimated from '@/components/CheckCircleAnimated'
import { XCircle } from 'lucide-react'

interface VerifyEmailResponse {
  data: {
    message: string
  }
  status: string
}

type VerifyEmailStatus = 'loading' | 'success' | 'error'

function VerifyEmail() {
  const { t } = useTranslation()
  const { token } = useParams()

  const [animationComplete, setAnimationComplete] = useState<boolean>(false)
  const [verificationStatus, setVerificationStatus] =
    useState<VerifyEmailStatus>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const animationDuration = 3000 // 3 seconds to animate after verification success

  useEffect(() => {
    if (token) {
      const verifyEmail = async () => {
        try {
          const response = await axios.get<VerifyEmailResponse>(
            `${import.meta.env.VITE_API_URL}/auth/verify-email/${token}`,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              },
            },
          )

          if (response.status !== 200) {
            setErrorMessage(t('emailVerification.verificationFailed'))
            setVerificationStatus('error')
            return
          }

          // if success
          setVerificationStatus('success')
        } catch (error) {
          console.error('Error verifying email:', error)
          setVerificationStatus('error')
          setErrorMessage(
            error instanceof Error
              ? error.message
              : t('emailVerification.verificationFailed'),
          )
        }
      }

      verifyEmail()
    }
  }, [token, t])

  // Redirect after animation completes
  useEffect(() => {
    if (animationComplete) {
      const redirectTimer = setTimeout(() => {
        navigate(AppConstantRoutes.paths.onboarding.welcome)
      }, 1000) // 1 second delay before redirecting

      return () => clearTimeout(redirectTimer)
    }
  }, [animationComplete, navigate])

  // Render different UI based on status
  return (
    <div className='fade-in flex min-h-screen flex-col items-center justify-center space-y-10 bg-white p-4'>
      <div className='flex w-full flex-col items-center justify-center space-y-8 px-4'>
        {verificationStatus === 'loading' && (
          <>
            <div className='border-primary h-12 w-12 animate-spin rounded-full border-4 border-t-transparent'></div>
            <p className='text-primary'>{t('emailVerification.verifying')}</p>
          </>
        )}

        {verificationStatus === 'success' && (
          <>
            <CheckCircleAnimated
              setAnimationComplete={setAnimationComplete}
              animationDuration={animationDuration}
            />
            <h1 className='text-2xl font-semibold'>
              {t('emailVerification.verified')}
            </h1>
            {animationComplete && (
              <p className='animate-fade-in text-gray-500'>
                {t('emailVerification.redirecting')}
              </p>
            )}
          </>
        )}

        {verificationStatus === 'error' && (
          <>
            <div className='text-red-500'>
              <XCircle size={64} strokeWidth={1} />
            </div>
            <h1 className='text-xl text-red-500'>
              {t('emailVerification.verificationFailed')}
            </h1>
            <p className='text-gray-700'>{errorMessage}</p>
          </>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail
