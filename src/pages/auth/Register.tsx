import Button from '@/components/common/Button'
import DropDown from '@/components/common/DropDown'
import Input from '@/components/common/Input'
import { AppConstantRoutes } from '@/services/routes/path'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import countryList from 'react-select-country-list'

const Register = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const countryOptions = new Map(
    countryList()
      .getData()
      .map((country) => [country.value, country.label]),
  )

  return (
    <form className='w-[85%] items-center justify-center space-y-5'>
      <div>
        <h1 className='text-[32px] font-medium text-[#333334]'>
          {t('Register.welcome')}
        </h1>
        <h3 className='text-[16px] font-light text-[#333334]/50'>
          {t('Register.instruction')}
        </h3>
      </div>
      <div className='flex flex-row gap-x-5'>
        <Input placeholder={t('Register.firstName')} type='text' />
        <Input placeholder={t('Register.lastName')} type='text' />
      </div>
      <Input placeholder={t('Register.username')} type='text' />
      <Input
        placeholder={t('Register.dateOfBirth')}
        type='date'
        className='text-zinc-500'
      />
      <DropDown itemList={countryOptions} placeholder='Country' />

      <Input placeholder={t('Register.password')} type='password' />
      <Input placeholder={t('Register.confirm')} type='password' />

      <div className='flex w-full justify-between'>
        <label className='flex items-center gap-x-2'>
          <input
            type='checkbox'
            id='remember'
            onChange={undefined}
            checked={undefined}
            className='h-6 w-6 accent-white'
            style={{ accentColor: 'green' }}
          />
          <span className='text-[13px] font-light text-[#333334]/50'>
            {t('Register.terms')}
          </span>
        </label>
        <Button primary type='submit' className='w-30'>
          {t('Register.register')}
        </Button>
      </div>
      <div className='mt-5 border-t border-[#333334]/30 pt-8 text-center'>
        <Button
          outline
          className='w-full'
          onClick={() => navigate(AppConstantRoutes.paths.auth.login)}
        >
          {t('Register.sentrian')}
        </Button>
      </div>
    </form>
  )
}

export default Register
