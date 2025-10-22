import { useSocketStore } from '@/zustand/socketStore'
// import { useTranslation } from 'react-i18next'
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

// component for Post Lists
interface ReportPostProps {
  postLists: ReportData[]
  isLoading?: boolean
}
const PostList: React.FC<ReportPostProps> = ({ postLists, isLoading }) => {
  const { userId } = useAuthStore(selectAuth)

  return (
    // * rendering get all reports
    <div className=''>
      {isLoading && (
        <div className='flex flex-col gap-4'>
          {/* Skeleton loading for post cards */}
          {[...Array(5)].map((_, index) => (
            <PostCardSkeleton key={index} />
          ))}
        </div>
      )}
      {postLists.map((postList, index) => {
        // imag url
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

// Home
const Home = () => {
  // const { t } = useTranslation()

  const connect = useSocketStore((state) => state.connect)
  const earthquakeAlertListener = useSocketStore(
    (state) => state.earthquakeAlertListener,
  )
  const sendUserLocation = useSocketStore((state) => state.sendUserLocation)
  const isConnected = useSocketStore((state) => state.isConnected)

  // use effect
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
        // set user current location global state via zustand
        setUserCurrentLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
      })
    }
  }, [isConnected, sendUserLocation])

  const { data, isLoading, error } = useGetAllDisasterReports()
  // console.log('report data: ', data)
  // console.log('data.pages', data?.pages)

  const reports =
    data?.pages?.flatMap((page) => page.data.reports.data ?? []) ?? []
  console.log('reports: ', reports)

  if (error) return <p>Error loading reports</p>

  return (
    <div className='fade-in'>
      <div className='w-3/4'>
        {/* Post Cards */}
        {reports.length === 0 ? (
          <NoDataStatement
            heading='No Disaster Report Found'
            subHeading="There's nothing here yet! Start by adding your first disaster report post."
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
