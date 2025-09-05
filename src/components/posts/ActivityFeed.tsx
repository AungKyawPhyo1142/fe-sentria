import ActivityPostCard from './ActivityPostCard'
import ActivityModalWithAPI from './ActivityModalWithAPI'
import DeleteActivityHandler from './DeleteActivityHandler'
import DropDown from '../common/DropDown'
import Input from '../common/Input'
import { ChevronDown, Droplets, HouseIcon, Utensils, Wifi } from 'lucide-react'
import { useState, useEffect } from 'react'
import {
  useGetActivities,
  Activity,
  ActivityType,
} from '@/services/network/lib/activity'
import { selectAuth, useAuthStore } from '@/zustand/authStore'
import {
  UserProfileMap,
  useBatchUserProfiles,
} from '@/services/network/lib/user'

export const ActivityFeed = () => {
  const [sortBy, setSortBy] = useState('latest')
  const [locationSearch, setLocationSearch] = useState('')
  const [selectedFilters, setSelectedFilters] = useState(
    new Set(['shelter', 'water', 'food', 'wifi']),
  )
  const [helpNeeded, setHelpNeeded] = useState(true)
  const [helpAvailable, setHelpAvailable] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null)
  const [activities, setActivities] = useState<Activity[] | null>(null)
  const [userProfiles, setUserProfiles] = useState<UserProfileMap>({})

  const { userId: currentUserId } = useAuthStore(selectAuth)

  // Fetch activities
  const { data: activitiesData, isLoading: activitiesLoading } =
    useGetActivities()

  // Get unique user IDs
  const userIds = activitiesData?.data
    ? [
        ...new Set(
          activitiesData.data
            .map((activity) => activity.postedById)
            .filter((id) => id !== undefined),
        ),
      ]
    : []

  const { data: batchUserProfiles, isSuccess: userProfilesFetched } =
    useBatchUserProfiles(userIds)

  // Update activities state when data changes
  useEffect(() => {
    if (activitiesData?.data) {
      setActivities(activitiesData.data)
    } else {
      setActivities([])
    }
  }, [activitiesData])

  // Update user profiles state when batch query succeeds
  useEffect(() => {
    if (userProfilesFetched && batchUserProfiles) {
      setUserProfiles(batchUserProfiles)
    }
  }, [batchUserProfiles, userProfilesFetched])

  const getUserDisplayInfo = (userId: number) => {
    if (!userId) {
      return {
        name: 'Unknown User',
        avatar: null,
        isVerified: false,
      }
    }

    const profile = userProfiles[userId]
    const isCurrentUser = userId === Number(currentUserId)

    return {
      name: profile
        ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() ||
          (isCurrentUser ? 'You' : 'Unknown User')
        : isCurrentUser
          ? 'You'
          : 'Unknown User',
      avatar: profile?.profile_image || null,
      isVerified: profile?.verified_profile || false,
    }
  }

  const getFilteredAndSortedActivities = () => {
    if (!activities || activities.length === 0) {
      return []
    }

    let filtered = [...activities]

    // Filter by location search
    if (locationSearch.trim()) {
      filtered = filtered.filter((activity) => {
        const location = `${activity.city}, ${activity.country}`
        return location.toLowerCase().includes(locationSearch.toLowerCase())
      })
    }

    if (selectedFilters.size > 0) {
      filtered = filtered.filter((activity) => {
        const helpTypes = activity.helpItems.map((item) =>
          item.helpType.toLowerCase(),
        )
        return Array.from(selectedFilters).some((filter) =>
          helpTypes.includes(filter),
        )
      })
    }

    filtered = filtered.filter((activity) => {
      if (helpNeeded && activity.activityType === ActivityType.REQUEST) {
        return true
      }
      if (helpAvailable && activity.activityType === ActivityType.OFFER) {
        return true
      }
      return false
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
        case 'oldest':
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )
        case 'nearest':
          // implement distance-based sorting when user location is available

          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
        default:
          return 0
      }
    })

    return filtered
  }

  const filteredActivities = getFilteredAndSortedActivities()

  const convertActivityToPostCard = (activity: Activity) => {
    const userInfo = getUserDisplayInfo(activity.postedById)

    return {
      user: userInfo,
      location: `${activity.city}, ${activity.country}`,
      content: activity.description || '',
      helpType:
        activity.activityType === ActivityType.OFFER
          ? ('Offering Help' as const)
          : ('Need Help' as const),
      offeredHelp: activity.helpItems.map((item) =>
        item.helpType.toLowerCase(),
      ),
      createdAt: new Date(activity.created_at),
    }
  }

  const sortOptions = ['latest', 'oldest', 'nearest']

  const filterItems = [
    { label: 'Shelter', id: 'shelter', icon: <HouseIcon strokeWidth={1.5} /> },
    { label: 'Water', id: 'water', icon: <Droplets strokeWidth={1.5} /> },
    { label: 'Food', id: 'food', icon: <Utensils strokeWidth={1.5} /> },
    { label: 'Wifi', id: 'wifi', icon: <Wifi strokeWidth={1.5} /> },
  ]

  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(filterId)) {
        newSet.delete(filterId)
      } else {
        newSet.add(filterId)
      }
      return newSet
    })
  }

  const clearAllFilters = () => {
    setLocationSearch('')
    setSelectedFilters(new Set(['shelter', 'water', 'food', 'wifi']))
    setHelpNeeded(true)
    setHelpAvailable(true)
    setSortBy('latest')
  }
  const handleEdit = (postId: string) => {
    const activity = activities?.find((a) => a.id === postId)
    if (activity) {
      setEditingActivity(activity)
      setIsCreateModalOpen(true)
    }
  }

  return (
    <div className='fade-in flex h-full w-full'>
      <div className='scrollbar-hide flex flex-1 flex-col overflow-y-auto'>
        <div className='mt-4 flex items-center justify-between gap-4 px-6 py-4'>
          <div className='flex flex-shrink-0 items-center gap-4'>
            <span className='text-[16px] font-extralight whitespace-nowrap text-black'>
              Sort by:
            </span>
            <div className='relative w-75 flex-shrink-0'>
              <DropDown
                className='min-h-[50px] w-full appearance-none text-sm'
                itemList={sortOptions.map(
                  (option) => option[0].toUpperCase() + option.slice(1),
                )}
                value={sortBy[0].toUpperCase() + sortBy.slice(1)}
                onChange={(e) => setSortBy(e.target.value.toLowerCase())}
                placeholder='Sort by'
              />
              <ChevronDown className='pointer-events-none absolute top-1/2 right-4 h-6 w-6 -translate-y-1/2 text-black' />
            </div>
          </div>
          <div className='max-w-md flex-1'>
            <Input
              showSearchIcon
              type='text'
              className={`min-h-[50px] w-full border-r ps-11 text-[16px] ${
                locationSearch.trim()
                  ? 'border-blue-300 ring-2 ring-blue-200'
                  : ''
              }`}
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              placeholder='Location'
            />
            {locationSearch.trim() && (
              <p className='mt-1 text-xs text-blue-600'>
                Searching: "{locationSearch}"
              </p>
            )}
          </div>
        </div>
        <div className='flex flex-col space-y-4 pt-6 pb-8'>
          {/* Loading state */}
          {activitiesLoading && (
            <div className='py-10 text-center text-gray-500'>
              Loading activities...
            </div>
          )}

          {/* Empty state */}
          {!activitiesLoading && (!activities || activities.length === 0) && (
            <div className='py-10 text-center text-gray-500'>
              No activities found. Create your first activity!
            </div>
          )}

          {!activitiesLoading &&
            activities &&
            activities.length > 0 &&
            filteredActivities.length === 0 && (
              <div className='py-10 text-center text-gray-500'>
                No activities match your current filters. Try adjusting your
                search criteria.
              </div>
            )}

          {!activitiesLoading && filteredActivities.length > 0 && (
            <DeleteActivityHandler>
              {(deleteHandler) =>
                filteredActivities.map((activity) => {
                  const postCardProps = convertActivityToPostCard(activity)
                  return (
                    <ActivityPostCard
                      key={activity.id}
                      user={postCardProps.user}
                      location={postCardProps.location}
                      content={postCardProps.content}
                      helpType={postCardProps.helpType}
                      offeredHelp={postCardProps.offeredHelp}
                      createdAt={postCardProps.createdAt}
                      onEdit={() => handleEdit(activity.id)}
                      onDelete={() => deleteHandler(activity.id)}
                      postedById={String(activity.postedById)}
                      loginUserId={String(currentUserId)}
                      activityId={activity.id}
                    />
                  )
                })
              }
            </DeleteActivityHandler>
          )}
        </div>
      </div>

      <div className='w-80 p-6'>
        <div className='flex flex-col gap-y-5'>
          <div className='mt-2 flex w-full flex-col gap-y-4 rounded-lg border border-[#33333430] p-4'>
            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-light text-[#3333344d]'>Filter by</h2>
              <button
                onClick={clearAllFilters}
                className='text-xs text-blue-500 underline hover:text-blue-700'
              >
                Clear all
              </button>
            </div>
            <hr className='mb-1 border-t border-[#33333430]' />
            <div className='flex flex-col gap-y-5'>
              {filterItems.map((item) => (
                <label
                  key={item.id}
                  htmlFor={item.id}
                  className='flex cursor-pointer flex-row items-center justify-between gap-x-2'
                >
                  <div className='flex flex-row items-center gap-x-5'>
                    {item.icon}
                    <span className='text-base text-gray-700'>
                      {item.label}
                    </span>
                  </div>
                  <input
                    type='checkbox'
                    id={item.id}
                    className='accent-primary h-4 w-4 cursor-pointer rounded border-gray-300'
                    checked={selectedFilters.has(item.id)}
                    onChange={() => toggleFilter(item.id)}
                  />
                </label>
              ))}
            </div>
          </div>
          <button
            className={`min-h-[50px] w-full cursor-pointer rounded-lg border py-2 text-base font-light transition-all duration-200 ease-in-out hover:opacity-[90%] active:opacity-100 ${
              helpNeeded
                ? 'bg-red border-red text-white'
                : 'text-red border-red hover:bg-red/80 bg-transparent hover:text-white'
            }`}
            onClick={() => setHelpNeeded(!helpNeeded)}
          >
            Help Needed
          </button>
          <button
            className={`min-h-[50px] w-full cursor-pointer rounded-lg border py-2 text-base font-light transition-all duration-200 ease-in-out hover:opacity-[90%] active:opacity-100 ${
              helpAvailable
                ? 'bg-secondary border-secondary text-white'
                : 'text-secondary border-secondary hover:bg-secondary/80 bg-transparent hover:text-white'
            }`}
            onClick={() => setHelpAvailable(!helpAvailable)}
          >
            Help Available
          </button>
        </div>
      </div>

      <ActivityModalWithAPI
        isOpen={isCreateModalOpen}
        setIsOpen={setIsCreateModalOpen}
        editActivity={editingActivity}
      />
    </div>
  )
}
