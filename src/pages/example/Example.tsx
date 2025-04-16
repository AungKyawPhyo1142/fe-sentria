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
    <div className='flex h-screen flex-col items-center justify-center bg-gray-100'>
      <div className='w-96 rounded bg-white p-8 shadow-md'>
        <div className='flex flex-col gap-4'>
          <h2 className='mb-6 text-center text-2xl font-bold'>
            Example & Count: {count}
          </h2>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => increment()}
              className='w-[200px] rounded bg-green-300 py-2 text-center'
            >
              Increase
            </button>
            <button
              onClick={() => decrement()}
              className='w-[200px] rounded bg-red-300 py-2 text-center'
            >
              Decrease
            </button>
          </div>
        </div>
        <button
          onClick={() => navigate(AppConstantRoutes.paths.auth.login)}
          className='mt-10 w-[200px] rounded bg-green-300 py-2 text-center'
        >
          Go to Login
        </button>
      </div>
    </div>
  )
}

export default Example
