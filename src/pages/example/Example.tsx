import { AppConstantRoutes } from '@/services/routes/path'
import {
  decrement,
  increment,
  selectCount,
  useCountStore,
} from '@/zustand/countStore'
import { useNavigate } from 'react-router'

const Example = () => {
  const navigate = useNavigate()

  const count = useCountStore(selectCount)
  return (
    <div className='fade-in flex h-screen flex-col items-center justify-center bg-white'>
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
        <button
          onClick={() => navigate(AppConstantRoutes.paths.auth.login)}
          className='bg-primary mt-10 w-[200px] rounded py-2 text-center text-white'
        >
          Go to Login
        </button>
      </div>
    </div>
  )
}

export default Example
