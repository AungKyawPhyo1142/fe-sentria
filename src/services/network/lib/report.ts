import { useQuery } from '@tanstack/react-query'
import { STATUS } from './auth'
import { apiClient } from '../apiClient'
import { ApiConstantRoutes } from '../path'

// export interface Report {
//   id: string
//   description: string
//   name: string
//   severity: string
//   incidentType: string
//   incidentTimestamp: string
//   location: {
//     city: string
//     country: string
//     latitude: number
//     longitude: number
//   }
//   media: string[]
//   postgresReportId: string
//   reporterUserId: number
//   reportName: string
//   factCheck: {
//     communityScore: {
//       upvotes: number
//       downvotes: number
//     }
//     goService: {
//       status: string
//       confidenceScore: number | null
//       lastCheckedAt: string | null
//     }
//     overallPercentage: number
//     lastCalculatedAt: string
//   }
//   created_at: string
//   updated_at: string
//   country: string
//   city: string
//   system_updated_at: string
//   generatedBy: {
//     id: number
//     firstName: string
//     lastName: string
//     profile_image: string
//   }
//   dbStatus: string
//   status: string
//   externalStorageId: string
//   errorMessage: string | null
//   generatedById: number
//   completed_at: string
//   factCheckStatus: string
//   factCheckOverallPercentage: number
//   upvoteCount: number
//   downvoteCount: number
//   commentCount: number
//   userId: string | null
// }

export interface Report {
  id: string
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
      commentCount: number
    }
    goService: {
      status: string
      confidenceScore: number | null
      narrative?: string
      evidence?: {
        source: string
        url?: string
        summary: string
        confidence: number
        timestamp: string
      }[]
      lastCheckedAt: string | null
      serviceProvider?: string
      processingError?: string | null
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
