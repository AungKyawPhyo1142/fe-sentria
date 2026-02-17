import AuthLayout from '@/components/auth/AuthLayout'
import LanguageDropdown from '@/components/common/LanguageDropdown'
import { useLocation } from 'react-router'
import Login from './Login'
import Register from './Register'

const Container = () => {
  const route = useLocation()

  return (
    <AuthLayout>
      {route.pathname === '/auth/login' ? <Login /> : <Register />}
      <div className='mt-6 flex justify-center text-gray-500'>
        <LanguageDropdown />
      </div>
    </AuthLayout>
  )
}

export default Container
