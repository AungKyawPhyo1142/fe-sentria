import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../apiClient'
import { ApiConstantRoutes } from '../path'

export type STATUS = 'SUCCESS' | 'ERROR'

export interface UserProfileResponse {
  data: {
    id: number
    firstName: string
    lastName: string
    profile_image: string | null
    email: string
    password: string
    email_verified: boolean
    email_verified_at: Date | null
    verified_profile: boolean
    birthday: Date | null
    country: string
    created_at: Date
    updated_at: Date | null
    deleted_at: Date | null
  }
  status: STATUS
}

export const useUserProfile = (userId: string) => {
  return useQuery<UserProfileResponse>({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) throw new Error('No userId provided')

      return await apiClient.get(
        ApiConstantRoutes.paths.user.getProfile.replace(':id', userId),
      )
    },
    retry: false,
    enabled: !!userId, // Only run if userId is provided
  })
}

export const useUpdateProfileImage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, file }: { userId: string; file: File }) => {
      const formData = new FormData()
      formData.append('profile_image', file)

      return await apiClient.patch(
        ApiConstantRoutes.paths.user.updateProfile.replace(':id', userId),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
    },
    // automatically invalidate and refetch
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['userProfile', variables.userId],
      })
    },
  })
}
