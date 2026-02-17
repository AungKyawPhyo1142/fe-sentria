import { useNavigate } from 'react-router'
import { AppConstantRoutes } from '@/services/routes/path'
import Button from '@/components/common/Button'
import SentriaLogo from '@/assets/sentria-logo.svg?react'
import { useTranslation } from 'react-i18next'

function Welcome() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className='fade-in flex min-h-screen flex-col items-center justify-center space-y-18 bg-white p-4'>
      <h1 className='flex items-baseline space-x-3 text-4xl font-bold text-black md:text-6xl'>
        <span>Welcome to</span>

        <SentriaLogo className='h-12 object-contain md:h-15' />
      </h1>

      <Button
        onClick={() => {
          navigate(AppConstantRoutes.paths.onboarding.steps)
        }}
        variant='primary'
        type='button'
        size='lg'
        className='px-12'
      >
        {t('onboarding.letsTakeFirstStep')}
      </Button>
    </div>
  )
}

export default Welcome
