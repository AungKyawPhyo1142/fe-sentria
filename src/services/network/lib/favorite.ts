import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiConstantRoutes } from '@/services/network/path'
import { apiClient } from '../apiClient'
import { toast } from 'react-toastify'

export interface FavToggle {
  postId: string
  postType: 'FEED' | 'RESOURCE'
}

// interface ToggleResponse {
//   action: 'added' | 'removed'
//   message: string
//   isFavorited: boolean
// }

// get fav response
export interface FavoriteItem {
  id: string
  userId: number
  postId: string
  postType: 'FEED' | 'RESOURCE'
  favoriteTimestamp: string
  systemCreatedAt: string
  systemUpdatedAt: string
}
export interface FavoritesResponse {
  favorites: FavoriteItem[]
  pagination: {
    total: number
    limit: number
    skip: number
    hasMore: boolean
  }
}

// toggle fav
export const useToggleFavorite = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: FavToggle) => {
      return await apiClient.post(ApiConstantRoutes.paths.favorites.toggle, {
        post_id: payload.postId,
        post_type: payload.postType,
      })
    },
    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({ queryKey: ['favorites'] })

      const prevFavorites = queryClient.getQueryData<any>(['favorites'])

      // Optimistically update cache
      queryClient.setQueryData(['favorites'], (old: any) => {
        if (!old?.favorites) return old
        const alreadySaved = old.favorites.some(
          (f: any) => f.post_id === postId,
        )

        return {
          ...old,
          favorites: alreadySaved
            ? old.favorites.filter((f: any) => f.post_id !== postId)
            : [...old.favorites, { post_id: postId }],
        }
      })

      return { prevFavorites }
    },
    onError: (_err, _variables, context) => {
      if (context?.prevFavorites) {
        queryClient.setQueryData(['favorites'], context.prevFavorites)
      }
    },
    onSuccess: (res) => {
      const result = res?.data?.result
      if (result?.action === 'added') {
        toast.success('Added to favorites ✅')
      } else {
        toast.info('Removed from favorites ❌')
      }
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}

// get all fav
export function useGetAllFavorites() {
  return useQuery<FavoritesResponse>({
    queryKey: ['favorites'],
    queryFn: async () => {
      const res = await apiClient.get(
        ApiConstantRoutes.paths.favorites.getFavorites,
      )
      return res.data.result as FavoritesResponse
    },
    staleTime: 1000 * 60, // 1 minute
  })
}
