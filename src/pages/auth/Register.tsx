import Button from '@/components/common/Button'
import ImageSlide from '@/components/common/ImageSlide'
import Input from '@/components/common/Input'
import { AppConstantRoutes } from '@/services/routes/path'
import { useNavigate } from 'react-router'

const Register = () => {
  const navigate = useNavigate()
  return (
    <div className='flex h-screen flex-col items-center justify-center bg-gray-100'>
      <div className='justsify-center flex w-[60%] flex-row items-center rounded bg-white shadow-md'>
        <div className='flex-1'>
          <ImageSlide />
        </div>

        <div className='flex flex-1 flex-col p-6'>
          {/* Header  */}
          <div className='mb-10 flex flex-col items-start'>
            <h2 className='text-center text-4xl font-bold'>
              Welcome to Sentria!
            </h2>
            <span className='text-[16px] text-gray-400'>
              Please fill all the fields to register.
            </span>
          </div>

          {/* Centered form */}
          <div className='flex flex-1 flex-col items-center justify-center'>
            <form className='flex w-full flex-col gap-y-6'>
              <Input
                type='email'
                id='email'
                placeholder='Email'
                onChange={undefined}
                value={undefined}
                error={undefined}
              />

              <Input
                type='password'
                id='password'
                placeholder='Password'
                onChange={undefined}
                value={undefined}
                error={undefined}
              />

              <Input
                type='password'
                id='confirmPassword'
                placeholder='Confirm Password'
                onChange={undefined}
                value={undefined}
                error={undefined}
              />

              <div className='flex w-full flex-row items-center justify-between'>
                <label className='flex items-center gap-x-2'>
                  <input
                    type='checkbox'
                    id='remember'
                    onChange={undefined}
                    checked={undefined}
                    className='h-6 w-6 accent-white'
                    style={{ accentColor: 'green' }}
                  />
                  <span className='text-[16px]'>
                    Agree to terms and conditions
                  </span>
                </label>
                <Button
                  type='submit'
                  onClick={undefined}
                  className='w-40 bg-green-500'
                >
                  Register
                </Button>
              </div>
            </form>
            {/* divider */}
            <div className='my-6 flex w-full items-center justify-center'>
              <div className='h-[1px] w-full bg-gray-300' />
            </div>

            <Button
              onClick={() => navigate(AppConstantRoutes.paths.auth.login)}
              className='m-0 mt-4 w-full rounded-lg border-2 border-blue-400 bg-white px-4 py-2 text-center !text-blue-500 shadow-sm'
            >
              Already a Sentrian? Go back to Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
