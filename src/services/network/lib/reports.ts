import { useInfiniteQuery } from '@tanstack/react-query'
import { STATUS } from './auth'
import { apiClient } from '../apiClient'
import { ApiConstantRoutes } from '../path'

interface ReprortData {
  id: string
  reportType: string
  name: string
  parameters: {
    severity: string
    incidentType: string
    titleSummary: string
    locationSummary: string
  }
  status: string
  externalStorageId: string
  errorMessage: string
  generatedById: number
  created_at: string
  updated_at: string
  completed_at: string
  factCheckStatus: string
  factCheckOverallPercentage: number
  factCheckLastUpdatedAt: string
  upvoteCount: number
  downvoteCount: number
  commentCount: number
  userId: number | null
  factCheck?:{
    factCheckOverallPercentage: number
  }
}

export interface ReportResponse {
  data: {
    reports: {
      data: ReprortData[]
      nextCursor: string
      hasNextPage: boolean
    }
  }
  status: STATUS
}

const useGetAllDisasterReports = () => {
  return useInfiniteQuery<ReportResponse>({
    queryKey: ['get-all-disaster-reports'],
    queryFn: async ({ pageParam = 1 }) => {
      return apiClient.get(ApiConstantRoutes.paths.report.default, {
        params: {
          page: pageParam,
          limit: 10,
        },
      })
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.data.reports.nextCursor,
  })
}

export { useGetAllDisasterReports }
