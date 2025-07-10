import { LoginResponse } from '@/services/network/lib/auth'
import { LocalSelvices } from '@/services/storage/LocalServices'
import { create } from 'zustand'

export interface AuthState {
  username: string
  userId: string
  firstName: string
  lastName: string
  created_at: string
  status: 'idle' | 'failed' | 'success'
}
type AuthStore = {
  auth: AuthState
  initAfterLogin: (payload: LoginResponse, remember: boolean) => void
  cleanupAfterLogout: () => void
}
export const useAuthStore = create<AuthStore>((set) => ({
  auth: {
    username: '',
    userId: '',
    firstName: '',
    lastName: '',
    created_at: '',
    expires_at: '',
    status: 'idle',
  },
  initAfterLogin: (payload: LoginResponse, remember: boolean) => {
    if (payload.data && payload.status === 'SUCCESS') {
      console.log('payload:', payload)
      const data = payload.data
      const result: AuthState = {
        ...data,
        username: data.username,
        userId: data.userId ? data.userId.toString() : '',
        firstName: data.firstName,
        lastName: data.lastName,
        created_at: data.createdAt.toString(),
        status: 'success',
      }
      set({ auth: result })
      if (remember) {
        LocalSelvices.setLocalStorage(result)
      }
      console.log('AuthStore: User logged in:', result)
    } else {
      console.log('AuthStore: User login failed:', payload)
      set({ auth: { ...useAuthStore.getState().auth, status: 'failed' } })
    }
  },
  cleanupAfterLogout: () => {
    LocalSelvices.clearLocalStorage()
    set({
      auth: {
        username: '',
        userId: '',
        firstName: '',
        lastName: '',
        created_at: '',
        status: 'idle',
      },
    })
  },
}))

const storedAuth = LocalSelvices.getLocalStorage()
if (storedAuth) {
  useAuthStore.setState({ auth: storedAuth })
}

export const selectAuth = (state: AuthStore) => state.auth
export const initAfterLogin = (payload: LoginResponse, remember: boolean) =>
  useAuthStore.getState().initAfterLogin(payload, remember)
export const cleanupAfterLogout = () =>
  useAuthStore.getState().cleanupAfterLogout()
