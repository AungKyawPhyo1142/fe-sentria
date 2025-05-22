import { CircleCheckBig } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import axios from 'axios'
import { useEffect } from 'react'

// https://localhost:8080/verify-email/:token

interface VerifyEmailResponse {
  data: {
    message: string
  }
  status: string
}

function VerifyEmail() {
  const { t } = useTranslation()
  const { token } = useParams()

  useEffect(() => {
    if (token) {
      // Call api to verify the email
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
            throw new Error('Network response was not ok')
          }

          const data: VerifyEmailResponse = response.data
          if (data.status.toLowerCase() !== 'success') {
            throw new Error('Email verification failed')
          }
          // Handle success response
          console.log('Email verified successfully:', data.data.message)

          return data
        } catch (error) {
          console.error('Error verifying email:', error)
        }
      }

      verifyEmail()
    }
  }, [token])

  return (
    <div className='fade-in flex min-h-screen flex-col items-center justify-center space-y-10 bg-white p-4'>
      <div className='flex w-full flex-col items-center justify-center space-y-8 px-4'>
        {/* add animation for check icon */}
        <CircleCheckBig
          className='text-primary h-24 w-24'
          style={{ strokeWidth: 0.5 }}
          aria-hidden='true'
        />
        <h1 className='text-2xl font-semibold'>
          {t('emailVerification.verified')}
        </h1>
      </div>
    </div>
  )
}

export default VerifyEmail
