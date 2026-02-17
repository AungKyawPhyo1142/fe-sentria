import { useUserProfile } from '@/services/network/lib/user'
import { AppConstantRoutes } from '@/services/routes/path'
import { selectAuth, useAuthStore } from '@/zustand/authStore'
import { useNavigate } from 'react-router'
import { generateDefaultProfileImage } from '@/helpers/helpers'

const ProfileNav = () => {
  const navigate = useNavigate()
  const { userId } = useAuthStore(selectAuth)
  const {
    data: userProfile,
    isLoading: profileLoading,
    error: profileError,
  } = useUserProfile(userId)

  if (profileLoading)
    return <div className='h-8 w-8 animate-pulse rounded-full bg-gray-100' />

  if (profileError || !userProfile)
    return (
      <button
        onClick={() => navigate(AppConstantRoutes.paths.profile)}
        className='bg-primary/10 text-primary hover:ring-primary/30 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-xs font-semibold ring-2 ring-gray-100 transition-all duration-150'
      >
        {generateDefaultProfileImage(userProfile?.firstName)}
      </button>
    )

  return (
    <button
      onClick={() => navigate(AppConstantRoutes.paths.profile)}
      className='cursor-pointer'
    >
      {userProfile.profile_image ? (
        <img
          src={userProfile.profile_image}
          alt='profile'
          className='hover:ring-primary/30 h-8 w-8 rounded-full object-cover ring-2 ring-gray-100 transition-all duration-150'
        />
      ) : (
        <div className='bg-primary/10 text-primary hover:ring-primary/30 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ring-2 ring-gray-100 transition-all duration-150'>
          {generateDefaultProfileImage(userProfile?.firstName)}
        </div>
      )}
    </button>
  )
}

export default ProfileNav
