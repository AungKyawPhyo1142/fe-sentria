import {
  useGetAllFavorites,
  useToggleFavorite,
} from '@/services/network/lib/favorite'
import { Bookmark } from 'lucide-react'
import React from 'react'

interface FavoriteButtonProps {
  postId: string
  postType: 'FEED' | 'RESOURCE'
}
const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  postId,
  postType,
}) => {
  const { data } = useGetAllFavorites()
  const { mutate, isPending } = useToggleFavorite()

  const isSaved = data?.favorites?.some((fav) => fav.postId === postId) ?? false

  const handleClick = () => {
    mutate({ postId, postType })
  }
  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-all duration-200 ${
        isSaved
          ? 'bg-primary/10 text-primary'
          : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
      } ${isPending ? 'pointer-events-none opacity-50' : 'active:scale-90'}`}
      aria-label={isSaved ? 'Remove from favorites' : 'Save to favorites'}
    >
      <Bookmark
        size={15}
        strokeWidth={2}
        className={isSaved ? 'fill-primary' : ''}
      />
    </button>
  )
}
export default FavoriteButton
