import { AppConstantRoutes } from '@/services/routes/path'
import { useNavigate } from 'react-router'

const Login = () => {
  const navigate = useNavigate()
  return (
    <div className='flex h-screen flex-col items-center justify-center bg-gray-100'>
      <div className='w-96 rounded bg-white p-8 shadow-md'>
        <h2 className='mb-6 text-center text-2xl font-bold'>Login</h2>

        <button
          onClick={() => navigate(AppConstantRoutes.paths.example.default)}
          className='w-[200px] rounded bg-green-300 py-2 text-center'
        >
          Go to Example
        </button>
      </div>
    </div>
  )
}

export default Login
