import { useIsUserAuthenticated } from '@/services/network/lib/auth'
import { AppConstantRoutes } from '@/services/routes/path'
import { cleanupAfterLogout, initAfterLogin } from '@/zustand/authStore'
import { JSX, useEffect } from 'react'
import { Navigate } from 'react-router'

type Props = {
  children: JSX.Element
}

const SecureRoute = ({ children }: Props) => {
  const { data: response, isError, isSuccess } = useIsUserAuthenticated()

  useEffect(() => {
    if (isSuccess) {
      console.log('success', response)
      initAfterLogin({ ...response }, true)
    }
  }, [isSuccess, response])

  if (isError) {
    cleanupAfterLogout()
    return <Navigate to={AppConstantRoutes.paths.auth.login} replace />
  }
  if (isSuccess) {
    if (response.status === 'SUCCESS') {
      return children
    }
  } else {
    return <Navigate to='/' replace />
  }
  return null
}

export default SecureRoute
