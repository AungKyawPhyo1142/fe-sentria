import { useToggleFavorite } from '@/services/network/lib/favorite'
import { useQueryClient } from '@tanstack/react-query'
import { Bookmark } from 'lucide-react'
// import React, { useState, useEffect } from 'react'
import React from 'react'

interface FavoriteButtonProps {
  postId: string
  postType: 'FEED' | 'RESOURCE'
}
const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  postId,
  postType,
}) => {
  //   const [isSaved, setIsSaved] = useState(false)
  //   const [clicked, setClicked] = useState(false)
  const { mutate, isPending } = useToggleFavorite()

  const queryClient = useQueryClient()
  const favorites = queryClient.getQueryData<{ [key: string]: boolean }>([
    'favorites',
    postType,
  ])
  const isSaved = favorites?.[postId] ?? false

  const handleClick = () => {
    mutate({ postId, postType })
  }
  //   const toggleFavorite = () => {
  // setIsSaved((prev) => !prev)
  // setClicked(true)
  // Here you would typically also make an API call to save/remove the favorite status
  //   }

  //   useEffect(() => {
  //     if (clicked) {
  //       if (isSaved) {
  //         alert(`id: ${postId} is saved into favorite`)
  //         console.log(`id: ${postId} is saved into favorite`)
  //       } else {
  //         alert(`id: ${postId} is removed from favorite`)
  //         console.log(`id: ${postId} is removed from favorite`)
  //       }
  //       setClicked(false)
  //     }
  //   }, [isSaved, clicked, postId])
  return (
    <Bookmark
      onClick={handleClick}
      className={`cursor-pointer transition-all duration-200 ease-linear ${
        isSaved ? 'fill-accent text-accent' : 'text-gray-600'
      } ${isPending ? 'pointer-events-none opacity-60' : ''}`}
      aria-label={isSaved ? 'Unsave favorite' : 'Save to favorites'}
    />
  )
}
export default FavoriteButton
