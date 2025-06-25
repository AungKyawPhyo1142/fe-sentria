import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../apiClient'
import { ApiConstantRoutes } from '../path'

export type STATUS = 'SUCCESS' | 'ERROR'

export enum ResourceType {
  SURVIVAL = 'SURVIVAL',
  HOTLINE = 'HOTLINE',
  FIRST_AID = 'FIRST_AID',
}

export enum ResourceStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  AWAITING_DETAILS = 'AWAITING_DETAILS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface ResourceLocation {
  city: string
  country: string
  latitude: number
  longitude: number
}

export interface ResourceAddress {
  street: string
  district: string
  city?: string
  country?: string
  fullAddress: string
}

export interface CreateResourceParameters {
  description: string
  location: ResourceLocation
  address: ResourceAddress
}

// Main type for create resource form values
export interface CreateResourceFormValues {
  name: string
  resourceType: ResourceType
  parameters: CreateResourceParameters
}

export interface CreateResourceFormValuesWithFiles
  extends CreateResourceFormValues {
  imageFiles?: File[] // An array of image files to upload
}

export interface ResourceImage {
  type: 'IMAGE' | 'VIDEO'
  url: string
  caption?: string
}

export interface UpdateResourceParameters extends CreateResourceParameters {
  images?: ResourceImage[]
}

export interface UpdateResourceFormValues extends CreateResourceFormValues {
  parameters: UpdateResourceParameters
}

export interface GetResourceByIdResponse {
  data: Resource
  status: STATUS
}

export interface Resource {
  _id: string
  postgresResourceId: string
  userId: number
  name?: string
  description: string
  resourceType: ResourceType
  location: { type: string; coordinates: number[] }
  address: ResourceAddress
  media: ResourceImage[]
  resourceTimestamp: Date
  systemCreatedAt: Date
  systemUpdatedAt: Date
}

export interface Pagination {
  total: number
  limit: number
  skip: number
  hasMore: boolean
}

export interface ResourcesData {
  resources: Resource[]
  pagination: Pagination
}

export interface GetResourcesResponse {
  data: ResourcesData
  status: STATUS
}

export interface CreateResourceResult {
  postgresResourceId: string
  mongoDbResourceId: string
  message: string
}

export interface CreateResourceResponse {
  data: {
    result: CreateResourceResult
  }
  status: STATUS
}

export const useGetResources = () => {
  return useQuery<ResourcesData>({
    queryKey: ['resources'],
    queryFn: async () => {
      try {
        const response: GetResourcesResponse = await apiClient.get(
          ApiConstantRoutes.paths.resources.getAll,
        )

        if (response.data) {
          return response.data as ResourcesData
        } else {
          throw new Error('No data found in response')
        }
      } catch (error) {
        console.error('Error fetching resources:', error)
        throw error
      }
    },
  })
}

export const useGetResourceById = (id: number) => {
  return useQuery<Resource>({
    queryKey: ['resource', id],
    queryFn: async () => {
      const response: GetResourceByIdResponse = await apiClient.get(
        ApiConstantRoutes.paths.resources.getById.replace(':id', String(id)),
      )
      return response.data as Resource
    },
  })
}

export const useCreateResource = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateResourceFormValuesWithFiles) => {
      if (!data.imageFiles || data.imageFiles.length === 0) {
        const response: CreateResourceResponse = await apiClient.post(
          ApiConstantRoutes.paths.resources.create,
          {
            name: data.name,
            resourceType: data.resourceType,
            parameters: {
              description: data.parameters.description,
              location: data.parameters.location,
              address: data.parameters.address,
            },
          },
        )
        return response.data
      }

      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('resourceType', data.resourceType)
      formData.append(
        'parameters',
        JSON.stringify({
          description: data.parameters.description,
          location: data.parameters.location,
          address: data.parameters.address,
        }),
      )

      if (data.imageFiles.length === 1) {
        formData.append('files', data.imageFiles[0])
      } else {
        data.imageFiles.forEach((file) => {
          formData.append(`files`, file)
        })
      }

      const response: CreateResourceResponse = await apiClient.post(
        ApiConstantRoutes.paths.resources.create,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })
    },
  })
}

export interface UpdateResourceFormValuesWithFiles
  extends UpdateResourceFormValues {
  imageFiles?: File[] // arr of imgs
}

export const useUpdateResource = (id: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: UpdateResourceFormValuesWithFiles) => {
      if (!data.imageFiles || data.imageFiles.length === 0) {
        return await apiClient.put(
          ApiConstantRoutes.paths.resources.update.replace(':id', String(id)),
          {
            name: data.name,
            resourceType: data.resourceType,
            parameters: {
              description: data.parameters.description,
              location: data.parameters.location,
              address: data.parameters.address,
              images: data.parameters.images,
            },
          },
        )
      }

      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('resourceType', data.resourceType)
      formData.append(
        'parameters',
        JSON.stringify({
          description: data.parameters.description,
          location: data.parameters.location,
          address: data.parameters.address,
          images: data.parameters.images,
        }),
      )

      if (data.imageFiles.length === 1) {
        formData.append('files', data.imageFiles[0])
      } else {
        data.imageFiles.forEach((file) => {
          formData.append(`files`, file)
        })
      }

      return await apiClient.put(
        ApiConstantRoutes.paths.resources.update.replace(':id', String(id)),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })
      queryClient.invalidateQueries({ queryKey: ['resource', id] })
    },
  })
}

export const useDeleteResource = (id: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete(
        ApiConstantRoutes.paths.resources.delete.replace(':id', String(id)),
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })
      queryClient.removeQueries({ queryKey: ['resource', id] })
    },
  })
}
