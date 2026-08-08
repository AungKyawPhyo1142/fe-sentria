import { useState } from 'react'
import ImgSelection from '@/components/profile/ImageSelection'
import InfoSection from '@/components/profile/InfoSection'
import PostsControls from '@/components/profile/PostsControls'
import PostCard from '@/components/posts/PostCard'
import { useUserProfile } from '@/services/network/lib/user'
import { useUpdateProfileImage } from '@/services/network/lib/user'
import { selectAuth, useAuthStore } from '@/zustand/authStore'
import NoDataStatement from '@/components/common/NoDataStatement'
import { useGetAllDisasterReports } from '@/services/network/lib/disasterReport'
import ErrorFetch from '@/components/common/ErrorFetch'
// const samplePosts: PostCardProps[] = [
//   {
//     id: '1',
//     user: {
//       name: 'Scarlett Johansson',
//       avatar: null,
//       isVerified: true,
//     },
//     trustScore: 19,
//     isDebunked: true,
//     location: 'London, UK',
//     title: 'Storm hits London',
//     content:
//       'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout...',
//     images: [
//       'https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg',
//       'https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg',
//       'https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg',
//       'https://images.pexels.com/photos/709552/pexels-photo-709552.jpeg',
//       'https://images.pexels.com/photos/709552/pexels-photo-709552.jpeg',
//     ],
//     disasterType: 'storm',
//     upvotes: 3800,
//     downvotes: 1200,
//     comments: 8120,
//     createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
//   },
//   {
//     id: '2',
//     user: {
//       name: 'John Doe',
//       avatar: null,
//       isVerified: false,
//     },
//     trustScore: 80,
//     isDebunked: false,
//     location: 'London',
//     title: 'Flood in Underground',
//     content:
//       'A reader will be distracted by readable content of a page when looking at its layout...',
//     images: [
//       'https://images.pexels.com/photos/709552/pexels-photo-709552.jpeg',
//       'https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg',
//       'https://images.pexels.com/photos/709552/pexels-photo-709552.jpeg',
//     ],
//     disasterType: 'flood',
//     upvotes: 1000,
//     downvotes: 1200,
//     comments: 4350,
//     createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
//   },
// ]

const Profile = () => {
  const { userId } = useAuthStore(selectAuth)
  const updateUserProfileImage = useUpdateProfileImage()
  // const [filteredPosts, setFilteredPosts] = useState([])
  const [sortBy, setSortBy] = useState('recent')
  const [filterBy, setFilterBy] = useState('all')

  // Fetch user profile
  const {
    data: userProfile,
    isLoading: profileLoading,
    error: profileError,
  } = useUserProfile(userId)

  // // Fetch user posts with filters
  // const { data: postsData, isLoading: postsLoading } = useUserPosts(userId, {
  //   sortBy,
  //   filterBy
  // })

  // Filter and sort logic here
  // useEffect(() => {
  //   // Apply filters and sorting to posts
  //   // const filtered = applyFiltersAndSort(posts, filterBy, sortBy)
  //   setFilteredPosts(filtered)
  // }, [posts, filterBy, sortBy])

  const { data, isLoading, error, refetch } = useGetAllDisasterReports()
  const reports =
    data?.pages
      ?.flatMap((page) => page.data.reports.data ?? [])
      ?.filter((r) => r.generatedBy.id === userId) ?? []

  const handleUpdateProfileImage = async (file: File) => {
    try {
      await updateUserProfileImage.mutateAsync({ userId, file })
    } catch (error) {
      console.error('Failed to update profile image:', error)
    }
  }

  if (profileLoading)
    return <p className='text-primary p-4'>Loading Profile...</p>

  if (profileError)
    return (
      <p className='text-red'>Error loading profile: {profileError.message}</p>
    )

  if (!userProfile) return <p className='text-primary'>No user profile found</p>

  if (error)
    return (
      <ErrorFetch
        heading='Error fetching reports'
        subHeading='Please check your network or try again.'
        reFetch={refetch}
      />
    )

  return (
    <div className='fade-in -mt-16 bg-white py-2'>
      <div className='mb-8 flex items-start justify-items-start space-x-10 border-b border-[#33333430] pb-12'>
        <ImgSelection
          userProfile={userProfile}
          imageUrl={
            userProfile.profile_image !== null
              ? userProfile.profile_image
              : undefined
          }
          handleUpdateProfileImage={handleUpdateProfileImage}
        />
        <InfoSection
          name={userProfile.firstName + ' ' + userProfile.lastName}
          location={userProfile.country}
          isVerified={userProfile.verified_profile}
        />
      </div>
      <div>
        <PostsControls
          sortBy={sortBy}
          setSortBy={setSortBy}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          isVerified={userProfile.verified_profile}
        />
        <div className='mt-10'>
          {isLoading ? (
            <p>Loading your posts...</p>
          ) : reports.length === 0 ? (
            <NoDataStatement
              heading='No Posts Found'
              subHeading='You have not posted any disaster reports yet.'
            />
          ) : (
            <div className='flex flex-col gap-4'>
              {reports.map((post, index) => {
                const imageUrls =
                  post.media
                    ?.filter(
                      (m) =>
                        m.type?.toLowerCase() === 'image' &&
                        typeof m.url === 'string' &&
                        m.url.trim() !== '',
                    )
                    .map((m) => m.url) ?? []

                return (
                  <PostCard
                    key={index}
                    id={post._id}
                    reporterId={post.generatedBy.id}
                    loginUser={userId}
                    user={{
                      name: `${post.generatedBy.firstName} ${post.generatedBy.lastName}`,
                      avatar: post.generatedBy.profile_image,
                      isVerified: true,
                    }}
                    trustScore={post.factCheck.overallPercentage}
                    isDebunked={post.factCheck.goService.status === 'debunked'}
                    location={`${post.location.city}, ${post.location.country}`}
                    title={post.reportName}
                    content={post.description}
                    images={imageUrls}
                    disasterType={post.incidentType}
                    upvotes={post.factCheck.communityScore?.upvotes ?? 0}
                    downvotes={post.factCheck.communityScore?.downvotes ?? 0}
                    comments={0}
                    createdAt={new Date(post.createdAt)}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
