import { useSocketStore } from '@/zustand/socketStore'
import NotificationSidebar from '@/components/common/NotificationSidebar'
import PostCard, { PostCardSkeleton } from '@/components/posts/PostCard'
import {
  ReportData,
  useGetAllDisasterReports,
} from '@/services/network/lib/disasterReport'
import { selectAuth, useAuthStore } from '@/zustand/authStore'
import { setUserCurrentLocation } from '@/zustand/userCurrentLocationStore'
import { useEffect } from 'react'
import NoDataStatement from '@/components/common/NoDataStatement'
import ErrorFetch from '@/components/common/ErrorFetch'

interface ReportPostProps {
  postLists: ReportData[]
  isLoading?: boolean
}

const PostList: React.FC<ReportPostProps> = ({ postLists, isLoading }) => {
  const { userId } = useAuthStore(selectAuth)

  return (
    <div className='space-y-4'>
      {isLoading && (
        <>
          {[...Array(4)].map((_, index) => (
            <PostCardSkeleton key={index} />
          ))}
        </>
      )}
      {postLists.map((postList, index) => {
        const imageUrls =
          postList.media
            ?.filter(
              (m) =>
                typeof m?.type === 'string' &&
                m.type.toLowerCase() === 'image' &&
                typeof m.url === 'string' &&
                m.url.trim() !== '',
            )
            .map((m) => m.url) ?? []

        return (
          <PostCard
            reporterId={postList.generatedBy.id}
            key={index}
            id={postList._id}
            loginUser={userId}
            user={{
              name: `${postList.generatedBy.firstName} ${postList.generatedBy.lastName}`,
              avatar: postList.generatedBy.profile_image,
              isVerified: true,
            }}
            trustScore={postList.factCheck.overallPercentage}
            isDebunked={postList.factCheck.goService.status === 'debunked'}
            location={`${postList.location.city}, ${postList.location.country}`}
            title={postList.reportName}
            content={postList.description}
            images={imageUrls}
            disasterType={postList.incidentType}
            upvotes={postList.factCheck.communityScore?.upvotes ?? 0}
            downvotes={postList.factCheck.communityScore?.downvotes ?? 0}
            comments={0}
            createdAt={new Date(postList.createdAt)}
          />
        )
      })}
    </div>
  )
}

const Home = () => {
  const connect = useSocketStore((state) => state.connect)
  const earthquakeAlertListener = useSocketStore(
    (state) => state.earthquakeAlertListener,
  )
  const sendUserLocation = useSocketStore((state) => state.sendUserLocation)
  const isConnected = useSocketStore((state) => state.isConnected)

  useEffect(() => {
    connect()
    earthquakeAlertListener()
  }, [connect, earthquakeAlertListener])

  useEffect(() => {
    if (isConnected) {
      navigator.geolocation.getCurrentPosition((pos) => {
        sendUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
        setUserCurrentLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
      })
    }
  }, [isConnected, sendUserLocation])

  const { data, isLoading, error, refetch } = useGetAllDisasterReports()

  const reports =
    data?.pages?.flatMap((page) => page.data.reports.data ?? []) ?? []

  if (error)
    return (
      <ErrorFetch
        heading='Try Again!'
        subHeading="There's error data fetching in disaster reports. Please try again!"
        reFetch={refetch}
      />
    )

  return (
    <div className='fade-in'>
      <div className='mx-auto max-w-[640px]'>
        {reports.length === 0 && !isLoading ? (
          <NoDataStatement
            heading='No Reports Yet'
            subHeading='Start by adding your first disaster report to help your community stay informed.'
          />
        ) : (
          <PostList postLists={reports} isLoading={isLoading} />
        )}
      </div>
      <NotificationSidebar />
    </div>
  )
}

export default Home
