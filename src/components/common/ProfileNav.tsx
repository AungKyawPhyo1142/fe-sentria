import { useUserProfile } from '@/services/network/lib/user'
import { AppConstantRoutes } from '@/services/routes/path'
import { selectAuth, useAuthStore } from '@/zustand/authStore'
import { useNavigate } from 'react-router'
import { generateDefaultProfileImage } from '@/helpers/helpers'

const ProfileIcon: React.FC<{ firstChar: string | undefined }> = ({ firstChar }) => {
  return (
    <div className='size-12 rounded-full border flex items-center justify-center bg-primary text-white font-bold'>
      {firstChar}
    </div>
  )
}

const ProfileNav = () => {
  const navigate = useNavigate()
  const { userId } = useAuthStore(selectAuth)
  const {
    data,
    isLoading: profileLoading,
    error: profileError,
  } = useUserProfile(userId)
  const userProfile = data



  if (profileLoading)
    return <div className='size-12 rounded-full border border-black/30 object-cover bg-gray-300/30 animate-pulse' />

  if (profileError || !userProfile)
    return (
      // <Profile className='size-12 rounded-full border border-black/30 object-cover' /> // Render Profile SVG
      <ProfileIcon firstChar={generateDefaultProfileImage(userProfile?.firstName)} />
    )

  return (
    <div
      onClick={() => navigate(AppConstantRoutes.paths.profile)}
      className='flex h-12.5 cursor-pointer items-center justify-center'
    >
      {/* <Profile className='size-8 rounded-full object-cover' border border-black/30 px-4 py-1 /> */}
      {userProfile.profile_image ? (
        <img
          src={userProfile.profile_image}
          alt='profile'
          className='size-12 rounded-full border border-black/30 object-cover'
        />
      ) : (
        <ProfileIcon firstChar={generateDefaultProfileImage(userProfile?.firstName)} />
      )}
      {/* <span className='text-sm'> {userProfile.firstName + ' ' + userProfile.lastName}</span> */}
    </div>
    // <div
    //   onClick={() => navigate(AppConstantRoutes.paths.profile)}
    //   className='ml-5 flex h-12.5 w-50 cursor-pointer items-center justify-center space-x-2 rounded-xl border border-black/30 py-1'
    // >
    //   {userProfile.profile_image ? (
    //     <img
    //       src={userProfile.profile_image}
    //       alt='profile'
    //       className='h-11 w-11 rounded-full object-cover'
    //     />
    //   ) : (
    //     <Profile className='h-11 w-11 rounded-full object-cover' /> // Render Profile SVG
    //   )}
    //   <span className='ml-3 text-[16px]'>
    //     {userProfile.firstName + ' ' + userProfile.lastName}
    //   </span>
    // </div>
  )
}
export default ProfileNav
