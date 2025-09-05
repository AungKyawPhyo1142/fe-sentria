import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ApiConstantRoutes } from '@/services/network/path'
import { apiClient } from '../apiClient'

export interface FavToggle {
  postId: string
  postType: 'FEED' | 'RESOURCE'
}

export function useToggleFavorite() {
  const queryClient = useQueryClient()

  return useMutation<
    { postId: string; postType: 'FEED' | 'RESOURCE'; result: any }, // return type
    Error, // error type
    FavToggle, // variables type
    { previous: Record<string, boolean>; postType: string } // context type (for rollback)
  >({
    mutationFn: async ({ postId, postType }: FavToggle) => {
      const res = await apiClient.post(
        ApiConstantRoutes.paths.favorites.toggle,
        {
          post_id: postId,
          post_type: postType,
        },
      )
      return { postId, postType, result: res.data.result }
    },
    onMutate: async (vars) => {
      await queryClient.cancelQueries({
        queryKey: ['favorites', vars.postType],
      })

      const previous =
        queryClient.getQueryData<Record<string, boolean>>([
          'favorites',
          vars.postType,
        ]) ?? {}

      const newStatus = !previous[vars.postId]

      queryClient.setQueryData(['favorites', vars.postType], {
        ...previous,
        [vars.postId]: newStatus,
      })

      return { previous, postType: vars.postType }
    },
    onError: (_err, _vars, context) => {
      if (context) {
        queryClient.setQueryData(
          ['favorites', context.postType],
          context.previous,
        )
      }
    },
    onSettled: (_data, _error, vars) => {
      queryClient.invalidateQueries({ queryKey: ['favorites', vars.postType] })
    },
  })
}
