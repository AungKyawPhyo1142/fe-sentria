import { useGetFavoritesByType } from '@/services/network/lib/favorite'
import { useGetActivities } from '@/services/network/lib/activity'
import { useAuthStore, selectAuth } from '@/zustand/authStore'
import ActivityPostCard from './ActivityPostCard'
import LogoLoader from '../common/LogoLoader'
import NoFavStatement from '../common/NoFavStatement'
import ErrorFetch from '../common/ErrorFetch'

export const FavFeed = () => {
  const { userId: currentUserId } = useAuthStore(selectAuth)

  // Fetch favorites
  const {
    data: favData,
    isLoading: favLoading,
    error,
    refetch,
  } = useGetFavoritesByType('FEED')

  // Fetch all activities
  const { data: activitiesData, isLoading: activitiesLoading } =
    useGetActivities()

  if (favLoading || activitiesLoading) {
    return <LogoLoader />
  }

  if (!favData?.favorites || !activitiesData?.data) {
    return (
      <NoFavStatement
        heading='No Favorite Activity Post Found'
        subHeading="You haven't added any activity posts to Favorite!"
      />
    )
  }

  if (error) {
    <ErrorFetch
      heading='Try Again!'
      subHeading="There's error data fetching in favorite activity feed.Please try again!"
      reFetch={refetch}
    />
  }

  const favorites = favData.favorites
  const activities = activitiesData.data

  // Map favorites to full activity objects
  const favActivities = favorites
    .map((fav) => activities.find((a) => a.id === fav.postId))
    .filter((a): a is (typeof activities)[number] => a !== undefined)
  return (
    <div className='scrollbar-hide flex flex-col space-y-4 py-4'>
      {favActivities.length === 0 ? (
        <NoFavStatement
          heading='No Favorite Activity Post Found'
          subHeading="You haven't favorited any activity posts yet!"
        />
      ) : (
        favActivities.map((act) => (
          <ActivityPostCard
            key={act.id}
            user={{
              name: `${act.postedBy?.firstName ?? ''} ${act.postedBy?.lastName ?? ''}`,
              avatar: act.postedBy?.profile_image || null,
              isVerified: false,
            }}
            location={`${act.city ?? ''}, ${act.country ?? ''}`}
            content={act.description ?? ''}
            helpType={
              act.activityType === 'OFFER' ? 'Offering Help' : 'Need Help'
            }
            offeredHelp={
              act.helpItems?.map((item) => item.helpType.toLowerCase()) ?? []
            }
            createdAt={new Date(act.created_at)}
            postedById={String(act.postedById)}
            loginUserId={String(currentUserId)}
            activityId={act.id}
          />
        ))
      )}
    </div>
  )
}
