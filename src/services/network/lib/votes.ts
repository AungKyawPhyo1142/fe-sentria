import { useMutation, useQueryClient } from '@tanstack/react-query'
import { STATUS } from './auth'
import { apiClient } from '../apiClient'
import { ApiConstantRoutes } from '../path'

export interface Votes {
  voteType: 'UPVOTE' | 'DOWNVOTE'
}

export interface VoteItems {
  id: string // postgresReportId from details
  reportType: string // 'DISASTER_INCIDENT'
  name: string
  parameters: {
    location: {
      type: string //'Point'
      coordinates: { lat: number; long: number }
    }
    severity: string //'SEVERE'
    description: string
    incidentType: string // 'EARTHQUAKE'
    incidentTimestamp: string
  }
  country: string
  city: string
  dbStatus: string //'PUBLISHED_IN_MONGODB'
  status: string //'FACTCHECK_PENDING'
  externalStorageId: string //id
  errorMessage: string | null
  generatedById: string //post creater
  created_at: string
  updated_at: string
  completed_at: string
  factCheckStatus: string
  factCheckOverallPercentage: number
  factCheckLastUpdatedAt: string | null
  upvoteCount: number
  downvoteCount: number
  commentCount: number
  userId: string // login user
}
export interface VotesResponse {
  data: VoteItems[]
  status: STATUS
}

export function useVote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      voteType,
    }: {
      id: string
      voteType: Votes['voteType']
    }): Promise<VotesResponse> => {
      try {
        const res = await apiClient.post<VotesResponse>(
          ApiConstantRoutes.paths.report.votingReport(id),
          { voteType },
        )
        return res.data
      } catch (error) {
        throw error
      }
    },
    // Refresh updated reports afeter voting is success
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-all-disaster-reports'] })
      queryClient.invalidateQueries({
        queryKey: ['get-disaster-report-detail'],
      })
    },
  })
}
