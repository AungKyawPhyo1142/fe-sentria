import { useGetFavoritesByType } from '@/services/network/lib/favorite'
import { useAuthStore, selectAuth } from '@/zustand/authStore'
import ResourceCard from '../resources/ResourceCard'
import { useGetResources } from '@/services/network/lib/resources'
import {
  UserProfileMap,
  useBatchUserProfiles,
} from '@/services/network/lib/user'
import { useEffect, useState } from 'react'

export const FavResource = () => {
  const [userProfiles, setUserProfiles] = useState<UserProfileMap>({})
  const { userId: currentUserId } = useAuthStore(selectAuth)

  // Fetch favorites
  const { data: favData, isLoading: favLoading } =
    useGetFavoritesByType('RESOURCE')

  // Fetch all resources
  const { data: resourcesData, isLoading: resourcesLoading } = useGetResources()

  // user
  const userIds = resourcesData?.resources
    ? [
        ...new Set(
          resourcesData.resources
            .map((resource) => resource.userId)
            .filter((id) => id !== undefined),
        ),
      ]
    : []

  const { data: batchUserProfiles, isSuccess: userProfilesFetched } =
    useBatchUserProfiles(userIds)

  useEffect(() => {
    if (userProfilesFetched && batchUserProfiles) {
      setUserProfiles(batchUserProfiles)
    }
  }, [batchUserProfiles, userProfilesFetched])

  // loading state
  if (favLoading || resourcesLoading) {
    return <p>Loading...</p>
  }

  if (!favData?.favorites || !resourcesData?.resources) {
    return <p>No favorites found</p>
  }

  // favorites and resources
  const favorites = favData.favorites
  const resources = resourcesData.resources
  const favResources = favorites
    .map((fav) => resources.find((a) => a._id === fav.postId))
    .filter((a): a is (typeof resources)[number] => a !== undefined)

  // Map favorites to full activity objects

  const getUserDisplayInfo = (userId: number) => {
    if (!userId) {
      return { name: 'Unknown User', avatar: null, isVerified: false }
    }

    const profile = userProfiles[userId]
    const isCurrentUser = userId === Number(currentUserId)

    return {
      name: profile
        ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() ||
          (isCurrentUser ? 'You' : 'Unknown User')
        : isCurrentUser
          ? 'You'
          : 'Unknown User',
      avatar: profile?.profile_image || null,
      isVerified: profile?.verified_profile || false,
    }
  }

  return (
    <div className='flex flex-col space-y-4 py-4'>
      {favResources.length === 0 ? (
        <p>No favorite posts available.</p>
      ) : (
        favResources.map((act) => (
          <ResourceCard
            key={act._id}
            resourceId={act._id}
            user={getUserDisplayInfo(act.userId)}
            location={
              act.address?.city ||
              (act.location?.coordinates
                ? act.location.coordinates.join(', ')
                : 'Location not specified')
            }
            description={act.description || ''}
            resourceTypes={act.resourceType ? [act.resourceType] : []}
            images={act.media?.map((media) => media.url) || []}
            onReadMore={() => console.log('View full resource', act)}
          />
        ))
      )}
    </div>
  )
}
