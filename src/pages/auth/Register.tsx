import Button from '@/components/common/Button'
import DropDown from '@/components/common/DropDown'
import Input from '@/components/common/Input'
import Modal from '@/components/common/Modal'
import { useCustomEvents } from '@/services/formik/hooks'
import { authRequest, RegisterFormValues } from '@/services/network/lib/auth'
import { AppConstantRoutes } from '@/services/routes/path'
import { useFormik } from 'formik'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import countryList from 'react-select-country-list'
import { object, ObjectSchema, string } from 'yup'

const Register = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [errorModal, setErrorModal] = useState(false)

  const countryOptions = countryList()
    .getData()
    .map((country) => country.label)

  const initialValues: RegisterFormValues = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthday: '',
    country: '',
  }

  const validationSchema: ObjectSchema<RegisterFormValues> = object().shape({
    firstName: string().required(
      t('error.common.mandatory', { field: t('Register.firstName') }),
    ),
    lastName: string().required(
      t('error.common.mandatory', { field: t('Register.lastName') }),
    ),
    username: string().required(
      t('error.common.mandatory', { field: t('Register.username') }),
    ),
    email: string()
      .email(t('error.common.mandatory', { field: t('Register.email') }))
      .required(t('error.common.mandatory', { field: t('Register.email') })),
    password: string()
      .required(t('error.common.mandatory', { field: t('Register.password') }))
      .test(
        'check password length',
        'Password must be between 6 and 20 characters',
        () =>
          6 <= formik.values.password.length &&
          formik.values.password.length <= 20,
      )
      .matches(
        /(?=.*\d)(?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      ),
    confirmPassword: string()
      .required(t('error.common.mandatory', { field: t('Register.confirm') }))
      .test('passwords-match', 'Passwords must match', function (value) {
        return this.parent.password === value
      }),
    birthday: string().required(
      t('error.common.mandatory', { field: t('Register.dateOfBirth') }),
    ),
    country: string()
      .required(t('error.common.mandatory', { field: t('Register.country') }))
      .test('Country', 'Please select a country', function (value) {
        return !!value && countryOptions.includes(value as string)
      }),
  })

  const onSubmit = async (values: RegisterFormValues) => {
    const res = await authRequest.Register(values).catch(() => {
      setErrorModal(true)
      console.error('Registration failed')
    })
    if (res && res.status === 'SUCCESS') {
      console.log('Resending verification email to:', values.email)
      navigate(`${AppConstantRoutes.paths.auth.sent}?email=${values.email}`)
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    validateOnChange: false,
    validateOnBlur: false,
  })
  const { onInputChange } = useCustomEvents<RegisterFormValues>(formik)
  const { onSelectChange } = useCustomEvents<RegisterFormValues>(formik)

  return (
    <>
      <Modal
        isOpen={errorModal}
        title='An error occurred'
        type='error'
        onClick={() => setErrorModal(false)}
        withButtons={true}
        content='An unexpected error occurred. Please try again later.'
        setIsOpen={setErrorModal}
      />
      <form onSubmit={formik.handleSubmit} className='space-y-4'>
        <div className='mb-2'>
          <h1 className='text-2xl font-semibold text-gray-900'>
            {t('Register.welcome')}
          </h1>
          <p className='mt-1 text-sm text-gray-500'>
            {t('Register.instruction')}
          </p>
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <Input
            id='firstName'
            name='firstName'
            onChange={onInputChange}
            value={formik.values.firstName}
            error={formik.errors.firstName}
            placeholder={t('Register.firstName')}
            type='text'
          />
          <Input
            id='lastName'
            name='lastName'
            onChange={onInputChange}
            value={formik.values.lastName}
            error={formik.errors.lastName}
            placeholder={t('Register.lastName')}
            type='text'
          />
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <Input
            id='username'
            name='username'
            onChange={onInputChange}
            value={formik.values.username}
            error={formik.errors.username}
            placeholder={t('Register.username')}
            type='text'
          />
          <Input
            id='email'
            name='email'
            onChange={onInputChange}
            value={formik.values.email}
            error={formik.errors.email}
            placeholder={t('Register.email')}
            type='text'
          />
        </div>

        <Input
          id='birthday'
          name='birthday'
          onChange={onInputChange}
          value={formik.values.birthday}
          error={formik.errors.birthday}
          placeholder={t('Register.dateOfBirth')}
          type='date'
        />
        <DropDown
          id='country'
          name='country'
          itemList={countryOptions}
          placeholder='Country'
          value={formik.values.country}
          onChange={onSelectChange}
          errorMessage={formik.errors.country}
        />

        <Input
          id='password'
          name='password'
          onChange={onInputChange}
          value={formik.values.password}
          error={formik.errors.password}
          placeholder={t('Register.password')}
          type='password'
        />
        <Input
          id='confirmPassword'
          name='confirmPassword'
          onChange={onInputChange}
          value={formik.values.confirmPassword}
          error={formik.errors.confirmPassword}
          placeholder={t('Register.confirm')}
          type='password'
        />

        <div className='flex w-full items-center justify-between'>
          <label className='flex items-center gap-x-2'>
            <input
              type='checkbox'
              id='remember'
              onChange={undefined}
              checked={undefined}
              className='accent-primary h-4 w-4 rounded border-gray-200'
            />
            <span className='text-xs text-gray-500'>{t('Register.terms')}</span>
          </label>
        </div>

        <Button
          loading={formik.isSubmitting}
          disabled={formik.isSubmitting}
          variant='primary'
          size='lg'
          type='submit'
          className='w-full'
        >
          {t('Register.register')}
        </Button>

        <div className='border-t border-gray-200 pt-6'>
          <Button
            variant='outline'
            size='lg'
            className='w-full'
            onClick={() => navigate(AppConstantRoutes.paths.auth.login)}
            type='button'
          >
            {t('Register.sentrian')}
          </Button>
        </div>
      </form>
    </>
  )
}

export default Register
