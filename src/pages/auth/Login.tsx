import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { AppConstantRoutes } from '@/services/routes/path'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

const Login = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
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
        <Button
          outline
          className='w-full'
          onClick={() => navigate(AppConstantRoutes.paths.auth.register)}
        >
          {t('Login.create')}
        </Button>
      </div>
    </form>
  )
}

export default Login
