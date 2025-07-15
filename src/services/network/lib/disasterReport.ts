import { useInfiniteQuery } from '@tanstack/react-query'
import { STATUS } from './auth'
import { apiClient } from '../apiClient'
import { ApiConstantRoutes } from '../path'

export interface ReportData {
  _id: string
  name: string
  description: string
  incidentType: string
  severity: string
  incidentTimestamp: string
  location: {
    city: string
    country: string
    latitude: number
    longitude: number
  }
  media: {
    type: string
    url: string
    caption?: string
  }[]
  postgresReportId: string
  reporterUserId: number
  reportName: string
  factCheck: {
    communityScore?: {
      upvotes: number
      downvotes: number
      // commentCount: number
    }
    goService: {
      status: string
      confidenceScore: number | null
      lastCheckedAt: string | null
    }
    overallPercentage: number
    lastCalculatedAt: string
  }
  createdAt: string
  updatedAt: string
  generatedBy: {
    id: number | null
    firstName: string
    lastName: string
    profile_image: string | null
  }
}

export interface ReportResponse {
  data: {
    reports: {
      data: ReportData[]
      nextCursor: string | null
      hasNextPage: boolean
    }
  }
  status: STATUS
}

export const useGetAllDisasterReports = (searchQuery?: string) => {
  return useInfiniteQuery<ReportResponse>({
    queryKey: ['get-all-disaster-reports', searchQuery],
    queryFn: ({ pageParam = '' }) => {
      return apiClient.get(ApiConstantRoutes.paths.auth.getReports(), {
        params: {
          limit: 10,
          cursor: pageParam,
          search: searchQuery,
        },
      })
    },
    enabled: true,
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.data.reports.nextCursor,
  })
}
