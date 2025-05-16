import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import LanguageToggle from '@/components/common/LanguageToggle'
import ImageSlider from '@/components/imageSlider'
import { useTranslation } from 'react-i18next'

const Login = () => {
  const { t } = useTranslation()
  return (
    <div className='m-5 flex min-h-screen items-center justify-center'>
      <div className='flex w-[1000px] max-w-5xl overflow-hidden shadow-lg'>
        {/* Slider */}
        <div className='w-1/2'>
          <ImageSlider />
        </div>
        {/* Login form */}
        <div className='relative flex w-1/2 flex-col items-center justify-center rounded-r-[10px] border border-l-0 border-[#333334]/30 bg-[#F5FEFD] p-9'>
          <div className='absolute top-4 right-5'>
            <LanguageToggle />
          </div>
          <form className='items-center justify-center space-y-5'>
            <div>
              <h1 className='text-[32px] font-medium text-[#333334]'>
                {t('Login.welcome')}
              </h1>
              <h3 className='text-[16px] font-light text-[#333334]/50'>
                {t('Login.instruction')}
              </h3>
            </div>
            <Input placeholder={t('Login.email')} />
            <Input placeholder={t('Login.password')} type='password' />

            <div className='flex justify-between'>
              <Button primary type='submit' className='w-30'>
                {t('Login.login')}
              </Button>
              <a
                href='#'
                className='mt-2 text-sm font-light text-[#333334]/50 underline hover:italic'
              >
                {t('Login.forgot')}
              </a>
            </div>
            <div className='mt-5 border-t border-[#333334]/30 pt-8 text-center'>
              <Button outline className='w-full'>
                {t('Login.create')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
