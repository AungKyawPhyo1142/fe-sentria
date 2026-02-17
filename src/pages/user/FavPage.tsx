import ActivityPostCard from '@/components/posts/ActivityPostCard'
import { PostCardSkeleton } from '@/components/posts/PostCard'
import ResourceCard, {
  ResourceCardSkeleton,
} from '@/components/resources/ResourceCard'
import NoDataStatement from '@/components/common/NoDataStatement'
import ErrorFetch from '@/components/common/ErrorFetch'
import { useGetAllFavorites } from '@/services/network/lib/favorite'
import { useGetActivities } from '@/services/network/lib/activity'
import {
  useGetResources,
  type Resource,
} from '@/services/network/lib/resources'
import {
  UserProfileMap,
  useBatchUserProfiles,
} from '@/services/network/lib/user'
import { selectAuth, useAuthStore } from '@/zustand/authStore'
import { Bookmark, Newspaper, Package } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { Activity } from '@/services/network/lib/activity'

type FilterType = 'ALL' | 'FEED' | 'RESOURCE'

const FILTER_OPTIONS: {
  label: string
  id: FilterType
  icon: React.ElementType
}[] = [
  { label: 'All', id: 'ALL', icon: Bookmark },
  { label: 'Reports', id: 'FEED', icon: Newspaper },
  { label: 'Resources', id: 'RESOURCE', icon: Package },
]

type FavItem =
  | { type: 'FEED'; savedAt: string; data: Activity }
  | { type: 'RESOURCE'; savedAt: string; data: Resource }

const FavPage = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL')
  const [userProfiles, setUserProfiles] = useState<UserProfileMap>({})
  const { userId: currentUserId } = useAuthStore(selectAuth)

  // Fetch all favorites
  const {
    data: favData,
    isLoading: favLoading,
    error: favError,
    refetch: favRefetch,
  } = useGetAllFavorites()

  // Fetch all activities and resources to hydrate favorites
  const { data: activitiesData, isLoading: activitiesLoading } =
    useGetActivities()
  const { data: resourcesData, isLoading: resourcesLoading } = useGetResources()

  // Batch user profiles for resource cards
  const resourceUserIds = resourcesData?.resources
    ? [
        ...new Set(
          resourcesData.resources
            .map((r) => r.userId)
            .filter((id) => id !== undefined),
        ),
      ]
    : []

  const { data: batchUserProfiles, isSuccess: userProfilesFetched } =
    useBatchUserProfiles(resourceUserIds)

  useEffect(() => {
    if (userProfilesFetched && batchUserProfiles) {
      setUserProfiles(batchUserProfiles)
    }
  }, [batchUserProfiles, userProfilesFetched])

  // Build unified, sorted list of favorite items
  const favItems = useMemo<FavItem[]>(() => {
    if (!favData?.favorites) return []

    const items: FavItem[] = []

    for (const fav of favData.favorites) {
      if (fav.postType === 'FEED') {
        const activity = activitiesData?.data?.find((a) => a.id === fav.postId)
        if (activity) {
          items.push({
            type: 'FEED',
            savedAt: fav.favoriteTimestamp,
            data: activity,
          })
        }
      } else if (fav.postType === 'RESOURCE') {
        const resource = resourcesData?.resources?.find(
          (r) => r._id === fav.postId,
        )
        if (resource) {
          items.push({
            type: 'RESOURCE',
            savedAt: fav.favoriteTimestamp,
            data: resource,
          })
        }
      }
    }

    // Sort by saved timestamp, newest first
    items.sort(
      (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
    )

    return items
  }, [favData, activitiesData, resourcesData])

  const filteredItems =
    activeFilter === 'ALL'
      ? favItems
      : favItems.filter((item) => item.type === activeFilter)

  const feedCount = favItems.filter((i) => i.type === 'FEED').length
  const resourceCount = favItems.filter((i) => i.type === 'RESOURCE').length

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

  const isLoading = favLoading || activitiesLoading || resourcesLoading

  if (favError) {
    return (
      <ErrorFetch
        heading='Try Again!'
        subHeading="There's an error fetching your saved items. Please try again!"
        reFetch={favRefetch}
      />
    )
  }

  return (
    <div className='fade-in'>
      <div className='mx-auto max-w-[640px]'>
        {/* Page header */}
        <div className='mb-5 flex items-center justify-between'>
          <div className='flex items-center gap-2.5'>
            <Bookmark size={18} className='text-primary' strokeWidth={2.5} />
            <h1 className='text-[18px] font-semibold text-gray-800'>Saved</h1>
            {!isLoading && favItems.length > 0 && (
              <span className='rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500'>
                {favItems.length}
              </span>
            )}
          </div>

          {/* Count breakdown */}
          {!isLoading && favItems.length > 0 && (
            <div className='flex items-center gap-3 text-[11px] text-gray-400'>
              <span>{feedCount} reports</span>
              <span className='h-3 w-px bg-gray-200' />
              <span>{resourceCount} resources</span>
            </div>
          )}
        </div>

        {/* Filter pills */}
        {!isLoading && favItems.length > 0 && (
          <div className='mb-5 flex items-center gap-2'>
            {FILTER_OPTIONS.map(({ label, id, icon: Icon }) => {
              const isActive = activeFilter === id
              return (
                <button
                  key={id}
                  onClick={() => setActiveFilter(id)}
                  className={`flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[12px] font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-primary/8 text-primary ring-primary/15 ring-1'
                      : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-500'
                  }`}
                >
                  <Icon size={13} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{label}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Content */}
        <div className='space-y-4'>
          {/* Loading skeletons */}
          {isLoading && (
            <>
              <PostCardSkeleton />
              <ResourceCardSkeleton />
              <PostCardSkeleton />
            </>
          )}

          {/* Empty state */}
          {!isLoading && favItems.length === 0 && (
            <NoDataStatement
              heading='No Saved Items Yet'
              subHeading='Bookmark reports and resources to access them quickly later.'
            />
          )}

          {/* Filtered empty */}
          {!isLoading && favItems.length > 0 && filteredItems.length === 0 && (
            <NoDataStatement
              heading={`No Saved ${activeFilter === 'FEED' ? 'Reports' : 'Resources'}`}
              subHeading={`You haven't saved any ${activeFilter === 'FEED' ? 'reports' : 'resources'} yet.`}
            />
          )}

          {/* Items */}
          {filteredItems.map((item) => {
            if (item.type === 'FEED') {
              const act = item.data
              return (
                <ActivityPostCard
                  key={`feed-${act.id}`}
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
                    act.helpItems?.map((h) => h.helpType.toLowerCase()) ?? []
                  }
                  createdAt={new Date(act.created_at)}
                  postedById={String(act.postedById)}
                  loginUserId={String(currentUserId)}
                  activityId={act.id}
                />
              )
            }

            // RESOURCE
            const res = item.data
            return (
              <ResourceCard
                key={`resource-${res._id}`}
                resourceId={res._id}
                user={getUserDisplayInfo(res.userId)}
                location={
                  res.address?.city ||
                  (res.location?.coordinates
                    ? res.location.coordinates.join(', ')
                    : 'Location not specified')
                }
                description={res.description || ''}
                resourceTypes={res.resourceType ? [res.resourceType] : []}
                images={res.media?.map((m) => m.url) || []}
                createdAt={new Date(res.resourceTimestamp)}
                onReadMore={() => console.log('View full resource', res)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default FavPage
