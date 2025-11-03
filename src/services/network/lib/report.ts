import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
    queryFn: () => apiClient.get(ApiConstantRoutes.paths.report.default),
  })
}

export interface ReverseGeocodeResponse {
  data: {
    lat: number
    lng: number
    city: string
    country: string
  }
  status: STATUS
}

export const useReverseGeocode = (lat: number, lng: number) => {
  return useQuery<ReverseGeocodeResponse>({
    queryKey: ['get-reverse-geocode', lat, lng],
    queryFn: () => {
      return apiClient.post(ApiConstantRoutes.paths.location.reverseGeocode, {
        lat,
        lng,
      })
    },
  })
}

/*

{
    "data": {
        "id": "cmfxslvbn0003it0yhfon3372",
        "reportType": "DISASTER_INCIDENT",
        "name": "Flood in Danang",
        "parameters": {
            "severity": "MINOR",
            "incidentType": "FLOOD"
        },
        "country": "Vietnam",
        "city": "An Hải Ward",
        "dbStatus": "PUBLISHED_IN_MONGODB",
        "status": "FACTCHECK_COMPLETE",
        "externalStorageId": "68d3bc5a43e028db89cf061c",
        "errorMessage": null,
        "generatedById": "ed097f35-6c57-4776-b22d-55ef97635ad4",
        "created_at": "2025-09-24T09:39:38.579Z",
        "updated_at": "2025-10-24T17:08:25.215Z",
        "completed_at": "2025-09-24T09:39:38.580Z",
        "factCheckStatus": "UNVERIFIABLE_NO_GDACS_DATA",
        "factCheckOverallPercentage": 28,
        "factCheckLastUpdatedAt": "2025-09-24T09:39:40.433Z",
        "upvoteCount": 0,
        "downvoteCount": 1,
        "commentCount": 0,
        "userId": null
    },
    "status": "SUCCESS"
}
*/
export interface VoteResponse {
  data: {
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
    generatedById: string
    created_at: string
    updated_at: string
    completed_at: string
    factCheckStatus: string
    factCheckOverallPercentage: number
    factCheckLastUpdatedAt: string
    upvoteCount: number
    downvoteCount: number
    commentCount: number
    userId: string | null
  }
  status: STATUS
}

const VOTE_TYPE = {
  UPVOTE: 'UPVOTE',
  DOWNVOTE: 'DOWNVOTE',
}

export const useVoteReport = () => {
  const queryClient = useQueryClient()
  return useMutation<VoteResponse, unknown, { reportId: string; voteType: keyof typeof VOTE_TYPE }>({
    mutationKey: ['vote-report'],
    mutationFn: ({ reportId, voteType }) =>
      apiClient.post(`${ApiConstantRoutes.paths.report.vote}/${reportId}`, {
        voteType: VOTE_TYPE[voteType],
      }),
  })
}