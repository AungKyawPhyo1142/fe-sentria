import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../apiClient'
import { ApiConstantRoutes } from '../path'

export type STATUS = 'SUCCESS' | 'ERROR'

export enum ActivityType {
  OFFER = 'OFFER',
  REQUEST = 'REQUEST',
}

export enum HelpType {
  SHELTER = 'SHELTER',
  WATER = 'WATER',
  FOOD = 'FOOD',
  WIFI = 'WIFI',
}

export interface ActivityLocation {
  city: string
  country: string
  latitude: number
  longitude: number
}

export interface HelpItem {
  id?: string
  helpType: HelpType
  quantity?: number | null
  activityFeedPostId?: string
}

export interface PostedBy {
  id: number
  firstName: string
  lastName: string
  profile_image?: string | null
  username?: string
}

export interface CreateActivityRequest {
  activityType: ActivityType
  description: string
  location: ActivityLocation
  helpItems: Omit<HelpItem, 'id' | 'activityFeedPostId'>[]
}

export type UpdateActivityRequest = CreateActivityRequest

export interface Activity {
  id: string
  activityType: ActivityType
  description: string
  city: string
  country: string
  latitude: number
  longitude: number
  isActive: boolean
  isDeleted: boolean
  postedById: number
  created_at: string
  updated_at: string
  helpItems: HelpItem[]
  postedBy: PostedBy
}

export interface ActivitiesData {
  data: Activity[]
  nextCursor: string | null
  hasNextPage: boolean
}

export interface GetActivitiesResponse {
  data: ActivitiesData
  status: STATUS
}

export interface CreateActivityResult {
  newPost: Activity
}

export interface CreateActivityResponse {
  data: CreateActivityResult
  status: STATUS
}

export interface GetActivitiesParams {
  limit?: number
  page?: string
  // Add other query parameters as needed
}

export const useGetActivities = (params?: GetActivitiesParams) => {
  return useQuery<ActivitiesData>({
    queryKey: ['activities', params],
    queryFn: async () => {
      try {
        const queryParams = new URLSearchParams()
        if (params?.limit) queryParams.append('limit', params.limit.toString())
        if (params?.page) queryParams.append('page', params.page)

        const queryString = queryParams.toString()
        const url = queryString
          ? `${ApiConstantRoutes.paths.activity.getAll}?${queryString}`
          : ApiConstantRoutes.paths.activity.getAll

        const response: GetActivitiesResponse = await apiClient.get(url)

        if (response.data) {
          return response.data as ActivitiesData
        } else {
          throw new Error('No data found in response')
        }
      } catch (error) {
        console.error('Error fetching activities:', error)
        throw error
      }
    },
  })
}

export const useGetActivityById = (id: string) => {
  return useQuery<Activity>({
    queryKey: ['activity', id],
    queryFn: async () => {
      const response = await apiClient.get(
        ApiConstantRoutes.paths.activity.getById(id),
      )
      return response.data as Activity
    },
  })
}

export const useCreateActivity = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateActivityRequest) => {
      const response: CreateActivityResponse = await apiClient.post(
        ApiConstantRoutes.paths.activity.create,
        {
          activityType: data.activityType,
          description: data.description,
          location: {
            city: data.location.city,
            country: data.location.country,
            latitude: data.location.latitude,
            longitude: data.location.longitude,
          },
          helpItems: data.helpItems,
        },
      )

      return response.data as CreateActivityResult
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
    },
  })
}

export const useUpdateActivity = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: UpdateActivityRequest) => {
      const response = await apiClient.patch(
        ApiConstantRoutes.paths.activity.update.replace(':id', id),
        {
          activityType: data.activityType,
          description: data.description,
          location: {
            city: data.location.city,
            country: data.location.country,
            latitude: data.location.latitude,
            longitude: data.location.longitude,
          },
          helpItems: data.helpItems,
        },
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
      queryClient.invalidateQueries({ queryKey: ['activity', id] })
    },
  })
}

export const useDeleteActivity = (id: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete(
        ApiConstantRoutes.paths.activity.delete.replace(':id', id),
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
      queryClient.removeQueries({ queryKey: ['activity', id] })
    },
  })
}
