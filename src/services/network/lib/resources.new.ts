import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../apiClient'
import { ApiConstantRoutes } from '../path'

export type STATUS = 'SUCCESS' | 'ERROR'

// Resource type and status enums
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

// Type for location coordinates
export interface ResourceLocation {
  city: string
  country: string
  latitude: number
  longitude: number
}

// Type for address information
export interface ResourceAddress {
  street: string
  district: string
  city?: string
  country?: string
  fullAddress: string
}

// Type for resource parameters
export interface CreateResourceParameters {
  description: string
  location: ResourceLocation
  address: ResourceAddress
  media?: ResourceImage[]
}

// Extended type for form submission with files
export interface CreateResourceFormValuesWithFiles
  extends CreateResourceFormValues {
  imageFiles?: File[]
}

// Main type for create resource form values
export interface CreateResourceFormValues {
  name: string
  resourceType: ResourceType
  parameters: CreateResourceParameters
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

export interface getResourceByIdResponse {
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

export interface getResourcesResponse {
  data: {
    resources: Resource[]
    pagination: Pagination
  }
  status: STATUS
}

export interface createResourceResponse {
  data: {
    result: {
      postgresResourceId: string
      mongoDbResourceId: string
      message: string
    }
  }
  status: STATUS
}

export const useGetResources = () => {
  return useQuery<{ resources: Resource[]; pagination: Pagination }>({
    queryKey: ['resources'],
    queryFn: async () => {
      try {
        const response = await apiClient.get(
          ApiConstantRoutes.paths.resources.getAll,
        )

        // Make sure we're accessing the correct data structure
        if (response.data) {
          // If the response follows the expected structure
          return response.data
        } else {
          // If no data is found
          console.error('No data found in response:', response)
          throw new Error('No data found in response')
        }
      } catch (error) {
        console.error('Error fetching resources:', error)
        throw error // Re-throw to let React Query handle the error state
      }
    },
  })
}

export const useGetResourceById = (id: number) => {
  return useQuery<getResourceByIdResponse['data']>({
    queryKey: ['resource', id],
    queryFn: async () => {
      try {
        const response = await apiClient.get(
          ApiConstantRoutes.paths.resources.getById.replace(':id', String(id)),
        )
        return response.data.data
      } catch (error) {
        console.error(`Error fetching resource with ID ${id}:`, error)
        throw error
      }
    },
  })
}

/**
 * Helper function to try uploading with different field names
 * This helps work around issues with Multer configuration on the backend
 */
export async function createResourceWithRetry(
  data: CreateResourceFormValuesWithFiles,
) {
  // Common field names used in Multer configurations
  const possibleFieldNames = [
    'image',
    'file',
    'media',
    'avatar',
    'resource',
    'upload',
    'picture',
  ]

  if (!data.imageFiles || data.imageFiles.length === 0) {
    // No files to upload, use regular JSON endpoint
    return await apiClient.post(ApiConstantRoutes.paths.resources.create, {
      name: data.name,
      resourceType: data.resourceType,
      parameters: {
        description: data.parameters.description,
        location: data.parameters.location,
        address: data.parameters.address,
        media: data.parameters.media || [],
      },
    })
  }

  // Try each possible field name
  let lastError = null
  for (const fieldName of possibleFieldNames) {
    try {
      console.log(`Trying to upload with field name: "${fieldName}"`)

      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('resourceType', data.resourceType)
      formData.append(
        'parameters',
        JSON.stringify({
          description: data.parameters.description,
          location: data.parameters.location,
          address: data.parameters.address,
          media: data.parameters.media || [],
        }),
      )

      // Add the file with the current field name
      formData.append(fieldName, data.imageFiles[0])
      formData.append('imageCaption', 'Resource image')

      const response = await apiClient.post(
        ApiConstantRoutes.paths.resources.create,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      console.log(`Success with field name "${fieldName}"!`, response.data)
      return response
    } catch (error) {
      lastError = error
      console.error(`Failed with field name "${fieldName}":`, error)
      // Continue to the next field name
    }
  }

  // If we get here, all attempts failed
  console.error('All upload attempts failed with different field names')
  throw lastError
}

export const useCreateResource = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateResourceFormValuesWithFiles) => {
      console.log('Creating Resource with data:', data)

      try {
        // Use our retry function that tries different field names
        const response = await createResourceWithRetry(data)
        console.log('Create Resource Response:', response.data)
        return response.data
      } catch (error) {
        console.error(
          'Failed to create resource after multiple attempts:',
          error,
        )
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })
    },
  })
}

export const useUpdateResource = (id: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: UpdateResourceFormValues) => {
      const response = await apiClient.put(
        ApiConstantRoutes.paths.resources.update.replace(':id', String(id)),
        data,
      )
      return response.data
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
