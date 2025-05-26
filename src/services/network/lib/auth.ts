import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../apiClient'
import { ApiConstantRoutes } from '../path'

export type STATUS = 'SUCCESS' | 'ERROR'

export interface LoginResponse {
  data: {
    username: string
    createdAt: Date
    email: string
    firstName: string
    lastName: string
    userId: number
  }
  status: STATUS
}
export interface LoginFormValues {
  email: string
  password: string
}

export interface RegisterResponse {
  data: {
    firstName: string
    lastName: string
    username: string
    email: string
  }
  status: STATUS
}

export const authRequest = {
  async Login(v: LoginFormValues): Promise<LoginResponse> {
    return apiClient.post(ApiConstantRoutes.paths.auth.login, v)
  },
}
export const useIsUserAuthenticated = () => {
  return useQuery<LoginResponse>({
    queryKey: ['isUserAuthenticated'],
    retry: 1,
    queryFn: async () => {
      return apiClient.get(ApiConstantRoutes.paths.auth.default)
    },
  })
}
