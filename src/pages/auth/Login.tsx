import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import { useCustomEvents } from '@/services/formik/hooks'
import { authRequest, LoginFormValues } from '@/services/network/lib/auth'
import { AppConstantRoutes } from '@/services/routes/path'
import { getDefaultRoute } from '@/services/routes/router'
import { initAfterLogin } from '@/zustand/authStore'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { object, ObjectSchema, string } from 'yup'

const Login = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const initialValues: LoginFormValues = {
    email: '',
    password: '',
  }
  const validationSchema: ObjectSchema<LoginFormValues> = object().shape({
    email: string().email().required('Email is required'),
    password: string().required('Password is required'),
  })
  const onSubmit = async (values: LoginFormValues) => {
    const res = await authRequest.Login(values).catch((error) => {
      console.log('onSubmitres: ', res)
      if (error.status === 401) {
        console.log('Invalid credentials')
      } else {
        console.log('Failed to login: ', error)
      }
    })
    if (res && res.status === 'SUCCESS') {
      console.log('Login successful: ', res.data)
      initAfterLogin(res, true)
      const destination = getDefaultRoute()
      navigate(destination, { replace: true })
      console.log('Login successful!')
    } else {
      formik.setErrors({
        email: 'Invalid credentials',
        password: 'Invalid credentials',
      })
    }
  }
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    validateOnChange: false,
    validateOnBlur: false,
  })
  const { onInputChange } = useCustomEvents<LoginFormValues>(formik)

  return (
    <form
      onSubmit={formik.handleSubmit}
      className='items-center justify-center space-y-5'
    >
      <div>
        <h1 className='text-[32px] font-medium text-[#333334]'>
          {t('Login.welcome')}
        </h1>
        <h3 className='text-[16px] font-light text-[#333334]/50'>
          {t('Login.instruction')}
        </h3>
      </div>
      <Input
        type='text'
        autoComplete='email'
        name='email'
        onChange={onInputChange}
        value={formik.values.email}
        error={formik.errors.email}
        placeholder={t('Login.email')}
      />
      <Input
        type='password'
        name='password'
        autoComplete='current-password'
        onChange={onInputChange}
        value={formik.values.password}
        error={formik.errors.password}
        placeholder={t('Login.password')}
      />

      <div className='flex justify-between'>
        <Button
          primary
          type='submit'
          loading={formik.isSubmitting}
          disabled={formik.isSubmitting}
          className='w-30'
        >
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
          type='button'
        >
          {t('Login.create')}
        </Button>
      </div>
    </form>
  )
}

export default Login
