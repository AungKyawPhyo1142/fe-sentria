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
    <Bookmark
      onClick={handleClick}
      className={`cursor-pointer transition-all duration-200 ease-linear ${
        isSaved ? 'fill-accent text-accent' : 'text-gray-600'
      } ${isPending ? 'pointer-events-none opacity-60' : ''}`}
      aria-label={isSaved ? 'Remove from favorites' : 'Save to favorites'}
    />
  )
}
export default FavoriteButton
