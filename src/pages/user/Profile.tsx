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
    title: 'Storm hits London',
    content:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout...',
    images: [
      'https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg',
      'https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg',
      'https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg',
      'https://images.pexels.com/photos/709552/pexels-photo-709552.jpeg',
      'https://images.pexels.com/photos/709552/pexels-photo-709552.jpeg',
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
    title: 'Flood in Underground',
    content:
      'A reader will be distracted by readable content of a page when looking at its layout...',
    images: [
      'https://images.pexels.com/photos/709552/pexels-photo-709552.jpeg',
      'https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg',
      'https://images.pexels.com/photos/709552/pexels-photo-709552.jpeg',
    ],
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

  const [posts] = useState(samplePosts)
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
    <div className='fade-in -mt-16 bg-white py-2'>
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
