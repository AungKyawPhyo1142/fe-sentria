import PostCard from '@/components/posts/PostCard'
import { useGetAllReports } from '@/services/network/lib/report'
// import { useTranslation } from 'react-i18next'

const Home = () => {
  // const { t } = useTranslation()
  const { data, isLoading, error } = useGetAllReports()

  const getDisasterType = (
    type?: string,
  ): 'earthquake' | 'flood' | 'fire' | 'storm' | 'other' => {
    const lower = type?.toLowerCase()
    switch (lower) {
      case 'earthquake':
      case 'flood':
      case 'fire':
      case 'storm':
        return lower
      default:
        return 'other'
    }
  }
  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading reports</p>
  return (
    <div className='space-y-6'>
      {data?.data.reports.data.map((report) => (
        <PostCard
          key={report.id}
          id={report.id}
          user={{
            name: 'Name', //cause userId id null in response 
            avatar: null,
            isVerified: false,
          }}
          trustScore={report.parameters?.severity === 'SEVERE' ? 10 : 80}
          isDebunked={false}
          location={`${report.city}, ${report.country}`}
          content={report.name}
          disasterType={getDisasterType(report.parameters?.incidentType)}
          images={[]}
          upvotes={report.upvoteCount}
          downvotes={report.downvoteCount}
          comments={report.commentCount}
          createdAt={new Date(report.created_at)}
          onUpvote={() => {
            console.log(`Upvote for ${report.id}`)
          }}
          onDownvote={() => {
            console.log(`Downvote for ${report.id}`)
          }}
          onComment={() => {
            console.log(`Comment on ${report.id}`)
          }}
        />
      ))}
    </div>
  )
}
export default Home
