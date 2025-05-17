import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import LanguageToggle from '@/components/common/LanguageToggle'
import { AppConstantRoutes } from '@/services/routes/path'
import {
  decrement,
  increment,
  selectCount,
  useCountStore,
} from '@/zustand/countStore'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

const Example = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const count = useCountStore(selectCount)
  return (
    <div className='fade-in flex h-screen flex-col bg-white'>
      <div className='w-96 rounded-xl border border-black/30 bg-white p-8'>
        <div className='flex flex-col gap-4'>
          <h2 className='mb-6 text-center text-2xl font-bold'>
            Example & Count: {count}
          </h2>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => increment()}
              className='bg-primary w-[200px] rounded py-2 text-center text-white'
            >
              Increase
            </button>
            <button
              onClick={() => decrement()}
              className='bg-red w-[200px] rounded py-2 text-center text-white'
            >
              Decrease
            </button>
          </div>
        </div>
        <div className='mt-5 flex flex-col gap-y-3 rounded p-10'>
          <LanguageToggle />
          <p>
            {t('common.greeting', {
              name: 'Aung',
            })}
          </p>
          <p>
            {t('error.common.mandatory', {
              field: 'Name',
            })}
          </p>
        </div>
        <div className='mt-5 flex flex-col gap-y-3 rounded p-10'>
          <Input placeholder='example' />
          <Input placeholder='Password' type='password' />
          <Button primary>Primary Button</Button>
          <Button secondary>Secondary Button</Button>
          <Button destructive>Destructive Button</Button>
          <Button outline>Outline Button</Button>
        </div>
        <div className='mt-10 border-t border-black pt-4'>
          <button
            onClick={() => navigate(AppConstantRoutes.paths.auth.login)}
            className='bg-primary w-[200px] rounded py-2 text-center text-white'
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default Example
