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
            name:
              report.generatedBy.firstName + ' ' + report.generatedBy.lastName,
            avatar: report.generatedBy.profile_image,
            isVerified: false,
          }}
          trustScore={report.factCheck.overallPercentage}
          isDebunked={false}
          location={`${report.location.city}, ${report.location.country}`}
          title={report.name}
          content={report.description}
          disasterType={getDisasterType(report?.incidentType)}
          images={[]}
          upvotes={report.factCheck.communityScore?.upvotes}
          downvotes={report.factCheck.communityScore?.downvotes}
          comments={report.factCheck.communityScore?.commentCount}
          createdAt={new Date(report.createdAt)}
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
