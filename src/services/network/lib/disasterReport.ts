import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import { STATUS } from './auth'
import { apiClient } from '../apiClient'
import { ApiConstantRoutes } from '../path'
import axios from 'axios'
import { PlaceInfo } from '@/components/common/MapSelector'

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
    id: string
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
// Get report by Id
export interface ReportDetailResponse {
  data: {
    report: {
      data: ReportData
      message: string
    }
  }
  status: STATUS
}

//create report
export interface CreateReport {
  reportImage: File[]
  imageCaption?: string
  reportType: string
  name: string
  parameters: {
    description: string
    incidentType: string
    severity: string
    incidentTimestamp: string
    location: PlaceInfo
    media: any[] // should always be []
  }
}

interface CreateReportResponse {
  data: {
    result: {
      postgresReportId: string
      mongoDbReportId: string
      message: string
      currentStatus: string
    }
  }
  status: string
}

//get all reports
export const useGetAllDisasterReports = (searchQuery?: string) => {
  return useInfiniteQuery<ReportResponse>({
    queryKey: ['get-all-disaster-reports', searchQuery],
    queryFn: ({ pageParam = '' }) => {
      return apiClient.get(ApiConstantRoutes.paths.report.getReports(), {
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

// Get report by Id
export const useGetDisasterReportDetail = (id: string) => {
  return useQuery<ReportDetailResponse>({
    queryKey: ['get-disaster-report-detail', id],
    queryFn: () =>
      apiClient.get(ApiConstantRoutes.paths.report.getReportById(id)),
  })
}

//create report
export const useCreateDisasterReport = () =>
  useMutation<CreateReportResponse, Error, CreateReport>({
    mutationFn: async (data: CreateReport) => {
      const formData = new FormData()
      data.reportImage.forEach((file) => {
        formData.append('reportImage', file)
      })
      formData.append('imageCaption', '') // will always send blank
      formData.append('reportType', data.reportType)
      formData.append('name', data.name)

      const updatedParams = {
        ...data.parameters,
        media: [], // always empty
      }
      formData.append('parameters', JSON.stringify(updatedParams))

      // ✅ Log form data content before sending
      console.log('🔍 FormData being sent:')
      formData.forEach((value, key) => {
        console.log(`${key}:`, value)
      })

      try {
        const res = await axios.post(
          ApiConstantRoutes.paths.report.createReport,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )
        console.log(' Response:', res.data)
        return res.data
      } catch (error) {
        console.error('Failed to create report:', error)
      }
    },
  })
