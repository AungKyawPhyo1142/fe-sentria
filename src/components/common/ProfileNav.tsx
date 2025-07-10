import { useUserProfile } from '@/services/network/lib/user'
import { AppConstantRoutes } from '@/services/routes/path'
import { selectAuth, useAuthStore } from '@/zustand/authStore'
import { useNavigate } from 'react-router'
import Profile from '@/assets/Profile.svg?react'

const ProfileNav = () => {
  const navigate = useNavigate()
  const { userId } = useAuthStore(selectAuth)
  const {
    data,
    isLoading: profileLoading,
    error: profileError,
  } = useUserProfile(userId)
  const userProfile = data?.data
  if (profileLoading)
    return <p className='text-primary p-4'>Loading Profile...</p>

  if (profileError)
    return (
      <p className='text-red'>Error loading profile: {profileError.message}</p>
    )
  if (!userProfile) return <p className='text-primary'>No user profile found</p>

  return (
    <div
      onClick={() => navigate(AppConstantRoutes.paths.profile)}
      className='ml-5 flex h-12.5 w-50 cursor-pointer items-center justify-center space-x-2 rounded-xl border border-black/30 py-1'
    >
      {userProfile.profile_image ? (
        <img
          src={userProfile.profile_image}
          alt='profile'
          className='h-11 w-11 rounded-full object-cover'
        />
      ) : (
        <Profile className='h-11 w-11 rounded-full object-cover' /> // Render Profile SVG
      )}
      <span className='ml-3 text-[16px]'>
        {userProfile.firstName + ' ' + userProfile.lastName}
      </span>
    </div>
  )
}
export default ProfileNav
