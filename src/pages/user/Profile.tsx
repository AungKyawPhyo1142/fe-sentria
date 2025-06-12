import { useState } from 'react'
import ImgSelection from '@/components/profile/ImageSelection'
import InfoSection from '@/components/profile/InfoSection'
import PostsControls from '@/components/profile/PostsControls'
import PostCard from '@/components/posts/PostCard'
import { useUserProfile } from '@/services/network/lib/user'
import { useUpdateProfileImage } from '@/services/network/lib/user'
import { selectAuth, useAuthStore } from '@/zustand/authStore'

const samplePosts = [
  {
    id: '1',
    user: {
      name: 'Scarlett Johansson',
      avatar: null,
      isVerified: true,
    },
    trustScore: 19,
    isDebunked: true,
    location: 'London, UK',
    content:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English.',
    images: [
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400',

      'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400',
    ],
    disasterType: 'storm' as const,
    upvotes: 3800,
    downvotes: 1200,
    comments: 8120,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: '2',
    user: {
      name: 'John Doe',
      avatar: null,
      isVerified: false,
    },
    trustScore: 80,
    isDebunked: false,
    location: 'London',
    content:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    images: ['https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400'],
    disasterType: 'flood' as const,
    upvotes: 1000,
    downvotes: 1200,
    comments: 4350,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
]

const Profile = () => {
  const { userId } = useAuthStore(selectAuth)
  const updateUserProfileImage = useUpdateProfileImage()

  const [posts, setPosts] = useState(samplePosts)
  // const [filteredPosts, setFilteredPosts] = useState([])
  const [sortBy, setSortBy] = useState('recent')
  const [filterBy, setFilterBy] = useState('all')

  // Fetch user profile
  const {
    data,
    isLoading: profileLoading,
    error: profileError,
  } = useUserProfile(userId)
  const userProfile = data?.data

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

  return (
    <div className='mt-5 bg-white px-20 py-6'>
      <div className='mb-8 flex items-start justify-items-start space-x-10 border-b border-[#33333430] pb-12'>
        <ImgSelection
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
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} {...post} />)
          ) : (
            <p>No posts available</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
