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
    }) => {
      const res = await apiClient.post<VotesResponse>(
        ApiConstantRoutes.paths.report.votingReport(id),
        { voteType },
      )
      return res.data
    },

    onMutate: async ({ id, voteType }) => {
      await queryClient.cancelQueries({
        queryKey: ['get-disaster-report-detail', id],
      })
      const previousDetail = queryClient.getQueryData([
        'get-disaster-report-detail',
        id,
      ])

      queryClient.setQueryData(
        ['get-disaster-report-detail', id],
        (old: any) => {
          if (!old) return old
          return {
            ...old,
            data: {
              ...old.data,
              report: {
                ...old.data.report,
                data: {
                  ...old.data.report.data,
                  userVote: voteType,
                },
              },
            },
          }
        },
      )

      return { previousDetail }
    },

    onError: (_err, variables, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(
          ['get-disaster-report-detail', variables.id],
          context.previousDetail,
        )
      }
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['get-disaster-report-detail', variables.id],
      })
      queryClient.invalidateQueries({ queryKey: ['get-all-disaster-reports'] })
    },
  })
}
