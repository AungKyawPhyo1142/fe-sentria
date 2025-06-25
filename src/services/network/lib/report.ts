import { useQuery } from '@tanstack/react-query'
import { STATUS } from './auth'
import { apiClient } from '../apiClient'
import { ApiConstantRoutes } from '../path'

export interface Report {
  id: string
  reportType: string
  name: string
  parameters: {
    severity: string
    incidentType: string
  }
  country: string
  city: string
  dbStatus: string
  status: string
  externalStorageId: string
  errorMessage: string | null
  generatedById: number
  created_at: string
  updated_at: string
  completed_at: string
  factCheckStatus: string
  factCheckOverallPercentage: number
  upvoteCount: number
  downvoteCount: number
  commentCount: number
  userId: string | null
}

export interface GetReportsResponse {
  data: {
    reports: {
      data: Report[]
      nextCursor: string | null
      hasNextPage: boolean
    }
  }
  status: STATUS
}

export const useGetAllReports = () => {
  return useQuery<GetReportsResponse>({
    queryKey: ['get-all-reports'],
    queryFn: () => apiClient.get(ApiConstantRoutes.paths.auth.getReports()),
  })
}
