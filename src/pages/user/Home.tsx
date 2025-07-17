import { useSocketStore } from '@/zustand/socketStore'
// import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { AppConstantRoutes } from '@/services/routes/path'
import { useNavigate } from 'react-router'
import Button from '@/components/common/Button'
import NotificationSidebar from '@/components/common/NotificationSidebar'
import {
  ReportData,
  useGetAllDisasterReports,
} from '@/services/network/lib/disasterReport'
import PostCard from '@/components/posts/PostCard'
import { selectAuth, useAuthStore } from '@/zustand/authStore'

// component for Post Lists
interface ReportPostProps {
  postLists: ReportData[]
}
const PostList: React.FC<ReportPostProps> = ({ postLists }) => {
  const { userId } = useAuthStore(selectAuth)
  console.log('user id: ', userId)
  return (
    // * rendering get all reports
    <div className=''>
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
            disasterType={postList.incidentType as any}
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

  const navigate = useNavigate()

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
  }, [])
  useEffect(() => {
    if (isConnected) {
      navigator.geolocation.getCurrentPosition((pos) => {
        sendUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
      })
    }
  }, [isConnected])
  const { data, isLoading, error } = useGetAllDisasterReports()
  // console.log('report data: ', data)
  // console.log('data.pages', data?.pages)

  const reports =
    data?.pages?.flatMap((page) => page.data.reports.data ?? []) ?? []
  // console.log('length: ', reports.length)

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading reports</p>

  return (
    <div className='fade-in'>
      <div className='w-3/4'>
        <div className='mb-5 flex items-center gap-x-3'>
          <Button className='px-10' primary>
            Home Page
          </Button>
          <Button
            className='px-10'
            primary
            onClick={() => navigate(AppConstantRoutes.paths.resources)}
          >
            Resource Page
          </Button>
        </div>
        {/* Post Cards */}
        {reports.length === 0 ? (
          <p>No reports found.</p>
        ) : (
          <PostList postLists={reports} />
        )}
      </div>
      <NotificationSidebar />
    </div>
  )
}
export default Home
