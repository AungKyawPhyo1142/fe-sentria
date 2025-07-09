import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../apiClient'
import { ApiConstantRoutes } from '../path'

export type STATUS = 'SUCCESS' | 'ERROR'

export interface User {
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

export interface UserProfileResponse {
  data: User
  status: STATUS
}

// Map user IDs to their profile data
export interface UserProfileMap {
  [userId: number]: User
}

export const useUserProfile = (userId: string) => {
  return useQuery<User>({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) throw new Error('No userId provided')

      const response = await apiClient.get(
        ApiConstantRoutes.paths.user.getProfile.replace(':id', userId),
      )
      console.log('1. Fetched user profile:', response)
      // response.status
      // Extract just the user data from the response
      if (response.data) {
        return response.data
      } else {
        throw new Error('Invalid user profile data structure')
      }
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
      // Also invalidate batch user profiles
      queryClient.invalidateQueries({
        queryKey: ['userProfiles'],
      })
    },
  })
}

export const useBatchUserProfiles = (userIds: number[]) => {
  return useQuery<UserProfileMap>({
    queryKey: ['userProfiles', userIds],
    queryFn: async () => {
      if (userIds.length === 0) return {}

      try {
        const profilePromises = userIds.map(async (id) => {
          try {
            const response = await apiClient.get(
              ApiConstantRoutes.paths.user.getProfile.replace(
                ':id',
                String(id),
              ),
            )
            console.log(`Fetched user profile for ID ${id}:`, response)

            if (response.data) {
              return { id, data: response.data }
            } else {
              console.error(`Invalid response for user ID ${id}:`, response)
              return { id, data: null }
            }
          } catch (error) {
            console.error(`Error fetching user profile for ID ${id}:`, error)
            return { id, data: null }
          }
        })

        const profiles = await Promise.all(profilePromises)

        // Convert to a map
        const profileMap: UserProfileMap = {}
        profiles.forEach((profile) => {
          if (profile.data) {
            profileMap[profile.id] = profile.data
          } else {
            console.warn(`No data found for user ID ${profile.id}`)
          }
        })

        return profileMap
      } catch (error) {
        console.error('Error fetching user profiles:', error)
        return {}
      }
    },
    enabled: userIds.length > 0, // Only run if we have user IDs to fetch
    staleTime: 5 * 60 * 1000, // profiles fresh for 5 minutes
  })
}
