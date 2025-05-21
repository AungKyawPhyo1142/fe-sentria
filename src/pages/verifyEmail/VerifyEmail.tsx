import { CircleCheckBig } from 'lucide-react'
import { useTranslation } from 'react-i18next'
// import { useSearchParams } from 'react-router'
// import { useEffect } from 'react'

// https://your-frontend.com/verify-email?token=abc123

function VerifyEmail() {
  const { t } = useTranslation()
  // const [searchParams] = useSearchParams()
  // const token = searchParams.get('token')

  //   useEffect(() => {
  //     if (token) {
  //       // Call api to verify the email
  //       fetch(
  //         `${import.meta.env.VITE_API_URL}/auth/verify-email?token=${token}`,
  //         {
  //           method: 'GET',
  //           headers: {
  //             'Content-Type': 'application/json',
  //             Authorization: `Bearer ${localStorage.getItem('access_token')}`,
  //           },
  //         },
  //       )
  //         .then((response) => {
  //           if (!response.ok) {
  //             throw new Error('Network response was not ok')
  //           }
  //           return response.json()
  //         })
  //         .then((data) => {
  //           console.log('Email verified successfully:', data)
  //         })
  //         .catch((error) => {
  //           console.error('Error verifying email:', error)
  //         })
  //     }
  //   }, [token])

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
