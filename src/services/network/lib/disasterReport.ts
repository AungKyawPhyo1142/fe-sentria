import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { STATUS } from './auth'
import { apiClient } from '../apiClient'
import { ApiConstantRoutes } from '../path'
import { CreateReportFormValues } from '@/components/common/CreatePostModal'
import { toast } from 'react-toastify'

export interface PlaceInfo {
  city: string
  country: string
  lat: number
  lng: number
}

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
    media: [] // should always be []
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
  status: STATUS
}

// delete response
interface BackendReport {
  report: {
    mongoResourceId: string
    postgresResourceId: string
    message: string
    deletedAt: string
  }
}

interface DeleteReportResponse {
  data: BackendReport
  status: 'SUCCESS' | 'ERROR'
}

// edit report
export interface UpdateReportRequest {
  reportType: 'DISASTER_INCIDENT'
  name: string
  parameters: {
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
    media: string[] | null
  }
}

export interface UpdateReportResponse {
  data: {
    result: {
      mongoReportId: string
      postgresReportId: string
      message: string
      updatedAt: string
    }
  }
  status: STATUS
}

//get all reports
export const useGetAllDisasterReports = (searchQuery?: string) => {
  return useInfiniteQuery<ReportResponse>({
    queryKey: ['get-all-disaster-reports', searchQuery],
    queryFn: ({ pageParam = '' }) => {
      return apiClient.get(ApiConstantRoutes.paths.report.default, {
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
export const useCreateDisasterReport = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (
      formData: CreateReportFormValues,
    ): Promise<CreateReportResponse> => {
      const form = new FormData()

      form.append('reportType', formData.reportType)
      form.append('name', formData.name)

      // imgs
      if (formData.reportImage && formData.reportImage.length > 0) {
        formData.reportImage.forEach((file) => {
          form.append('reportImage', file)
        })
      }

      // parameters
      const parameters = {
        description: formData.parameters.description,
        incidentType: formData.parameters.incidentType,
        severity: formData.parameters.severity,
        incidentTimestamp: formData.parameters.incidentTimestamp,
        location: {
          city: formData.parameters.location.city,
          country: formData.parameters.location.country,
          latitude: formData.parameters.location.latitude,
          longitude: formData.parameters.location.longitude,
        },
        media: formData.parameters.media,
      }

      form.append('parameters', JSON.stringify(parameters))

      const res = await apiClient.post(
        ApiConstantRoutes.paths.report.createReport,
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      return res.data
    },
    onSuccess: () => {
      toast.success('Post created successfully!')
      // refetch all posts
      queryClient.invalidateQueries({
        queryKey: ['get-all-disaster-reports'],
        exact: false,
      })
    },
    onError: () => {
      toast.error('Failed to create post!')
    },
  })
}

// delete report
export const useDeleteReport = () => {
  const queryClient = useQueryClient()

  const deleteReportById = async (
    id: string,
  ): Promise<DeleteReportResponse> => {
    try {
      const res = await apiClient.delete<DeleteReportResponse>(
        ApiConstantRoutes.paths.report.deleteReport(id),
      )
      console.log('res.data:', res.data) // => { report: {...} }
      console.log('res.data.status:', res.data.status) // => 'SUCCESS' ✅
      console.log('FULL RES:', JSON.stringify(res, null, 2))
      console.log('FULL RES:', res)
      if (String(res.status) === 'SUCCESS') {
        toast.success('Report deleted successfully!')
        // Refetch or invalidate queries related to reports here:
        queryClient.invalidateQueries({
          queryKey: ['get-all-disaster-reports'],
          exact: false,
        })
      } else {
        toast.error('Failed to delete the report!')
      }

      return res.data
    } catch (error) {
      toast.error('Error deleting report. Please try again.')
      throw error
    }
  }

  return { deleteReportById }
}

// edit report
export const editDisasterReport = async (
  id: string,
  reportData: UpdateReportRequest,
): Promise<UpdateReportResponse> => {
  const response = await apiClient.patch<UpdateReportResponse>(
    ApiConstantRoutes.paths.report.editReport(id),
    reportData,
  )
  return response.data
}
