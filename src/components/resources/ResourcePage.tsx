import DropDown from '@/components/common/DropDown'
import Input from '@/components/common/Input'
import CreateResourceModal from '@/components/resources/CreateResourceModal'
import ResourceCard from '@/components/resources/ResourceCard'
import {
  CreateResourceFormValuesWithFiles,
  Resource,
  useCreateResource,
  useGetResources,
} from '@/services/network/lib/resources'
import {
  UserProfileMap,
  useBatchUserProfiles,
  useUserProfile,
} from '@/services/network/lib/user'
import { selectAuth, useAuthStore } from '@/zustand/authStore'
import {
  BriefcaseMedical,
  ChevronDown,
  CirclePlus,
  FlameKindling,
  PhoneCall,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import LogoLoader from '../common/LogoLoader'
import NoDataStatement from '../common/NoDataStatement'
import ErrorFetch from '../common/ErrorFetch'

export default function ResourcePage() {
  const [resources, setResources] = useState<Resource[] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userProfiles, setUserProfiles] = useState<UserProfileMap>({})
  const [locationSearch, setLocationSearch] = useState('')

  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest')

  const { userId: currentUserId } = useAuthStore(selectAuth)
  const { data: userProfile } = useUserProfile(String(currentUserId))

  const isVerified = userProfile?.verified_profile

  const {
    data: resourcesData,
    isLoading: resourcesLoading,
    error,
    refetch,
  } = useGetResources()

  const userIds = resourcesData?.resources
    ? [
        ...new Set(
          resourcesData.resources
            .map((resource) => resource.userId)
            .filter((id) => id !== undefined),
        ),
      ]
    : []

  const { data: batchUserProfiles, isSuccess: userProfilesFetched } =
    useBatchUserProfiles(userIds)

  useEffect(() => {
    if (resourcesData?.resources) {
      setResources(resourcesData.resources)
    } else {
      setResources([])
    }
  }, [resourcesData])

  // Update our userProfiles state when batch query succeeds
  useEffect(() => {
    if (userProfilesFetched && batchUserProfiles) {
      setUserProfiles(batchUserProfiles)
    }
  }, [batchUserProfiles, userProfilesFetched])

  const createResourceMutation = useCreateResource()

  const handleSaveResource = (
    resourceData: CreateResourceFormValuesWithFiles,
  ) => {
    console.log('Resource data to be saved:', resourceData)

    // Use the mutation to create the resource
    createResourceMutation.mutate(resourceData, {
      onSuccess: (response) => {
        console.log('Resource created successfully:', response)

        setIsModalOpen(false)
      },
      onError: (error) => {
        console.error('Error creating resource:', error)
      },
    })
  }

  // Helper function to get user display info for a resource
  const getUserDisplayInfo = (userId: number) => {
    if (!userId) {
      console.warn('Received undefined or null userId in getUserDisplayInfo')
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

  // Filter item list for resource types
  const filterItemList = [
    {
      label: 'Survival',
      id: 'SURVIVAL',
      icon: <FlameKindling strokeWidth={1.5} />,
    },
    { label: 'Hotline', id: 'HOTLINE', icon: <PhoneCall strokeWidth={1.5} /> },
    {
      label: 'First Aid',
      id: 'FIRST_AID',
      icon: <BriefcaseMedical strokeWidth={1.5} />,
    },
  ]
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(
    new Set(['SURVIVAL', 'HOTLINE', 'FIRST_AID']),
  )

  const filteredResources = resources
    ?.filter((resource) => {
      // Filter by resource type
      if (selectedTypes.size === 0) return true
      const typeMatch = selectedTypes.has(resource.resourceType || '')

      // Filter by location search if provided
      if (locationSearch.trim()) {
        const location =
          resource.address?.city ||
          (resource.location?.coordinates
            ? resource.location.coordinates.join(', ')
            : '')
        const locationMatch = location
          .toLowerCase()
          .includes(locationSearch.toLowerCase())
        return typeMatch && locationMatch
      }

      return typeMatch
    })
    ?.sort((a, b) => {
      const timeA = new Date(a.resourceTimestamp).getTime()
      const timeB = new Date(b.resourceTimestamp).getTime()

      return sortOrder === 'latest' ? timeB - timeA : timeA - timeB
    })

  const sortOptions = ['latest', 'oldest']

  if (error) {
    ;<ErrorFetch
      heading='Try Again!'
      subHeading="There's error data fetching in resources.Please try again!"
      reFetch={refetch}
    />
  }

  return (
    <div className='flex w-full items-start gap-8 p-6 px-0'>
      {/* resources */}
      <div className='flex w-full flex-col items-center justify-between'>
        <div className='mt-2 flex w-full items-center justify-between gap-4 py-4'>
          <div className='flex flex-shrink-0 items-center gap-4'>
            <span className='text-base font-normal whitespace-nowrap text-gray-900'>
              Sort by:
            </span>
            <div className='relative w-75 flex-shrink-0'>
              <DropDown
                className='h-10 w-full appearance-none text-sm'
                itemList={sortOptions.map(
                  (option) => option[0].toUpperCase() + option.slice(1),
                )}
                value={sortOrder[0].toUpperCase() + sortOrder.slice(1)}
                onChange={(e) =>
                  setSortOrder(
                    e.target.value.toLowerCase() as 'latest' | 'oldest',
                  )
                }
                placeholder='Sort by'
              />
              <ChevronDown className='pointer-events-none absolute top-1/2 right-4 h-6 w-6 -translate-y-1/2 text-gray-900' />
            </div>
          </div>
          <div className='max-w-md flex-1'>
            <Input
              showSearchIcon
              type='text'
              className={`h-10 w-full border-r ps-11 text-base ${
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
          {isVerified ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className='bg-primary flex h-12.5 flex-shrink-0 items-center justify-center rounded-xl px-4 py-1 font-normal text-white hover:cursor-pointer'
            >
              <CirclePlus size={26} strokeWidth={1} />
              <span className='ml-3 text-base'>Create a resource</span>
            </button>
          ) : (
            <div className='flex h-10 items-center justify-center rounded-lg border border-red-300 bg-red-50/50 px-4 text-center text-xs text-red-700'>
              Verify your profile to create resources
            </div>
          )}
        </div>

        {/* Resource List */}

        {/* Resource Cards */}
        <div className='mt-6 flex w-full flex-col items-center gap-y-4'>
          {resourcesLoading && (
            // <div className='py-10 text-center text-gray-500'>
            //   Loading resources...
            // </div>
            <LogoLoader />
          )}

          {!resourcesLoading && resources?.length === 0 && (
            <NoDataStatement
              heading='No Resource Post Found'
              subHeading="There's nothing here yet! Start by adding your first resource post."
            />
          )}

          {filteredResources?.map((resource, index) => (
            <ResourceCard
              key={resource._id || index}
              resourceId={resource._id}
              user={getUserDisplayInfo(resource.userId)}
              location={
                resource.address?.city ||
                (resource.location?.coordinates
                  ? resource.location.coordinates.join(', ')
                  : 'Location not specified')
              }
              description={resource.description || ''}
              resourceTypes={
                resource.resourceType ? [resource.resourceType] : []
              }
              images={resource.media?.map((media) => media.url) || []}
              onReadMore={() => console.log('View full resource', resource)}
            />
          ))}
        </div>

        {/* Resource Modal */}
        <div className='mt-10 flex w-full flex-col items-center gap-y-4'>
          <CreateResourceModal
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            onSave={handleSaveResource}
          />
        </div>
      </div>

      {/* Resource Filter */}
      <div className='flex w-2/6 flex-col items-center justify-center gap-y-5 pt-6'>
        <div className='flex w-full flex-col gap-y-4 rounded-lg border border-gray-200 p-4'>
          <h2 className='text-lg font-normal text-gray-400'>Filter by</h2>
          <hr className='mb-1 border-t border-gray-200' />
          <div className='flex flex-col gap-y-5'>
            {filterItemList.map((item) => (
              <label
                key={item.id}
                htmlFor={item.id}
                className='flex cursor-pointer flex-row items-center justify-between gap-x-2'
              >
                <div className='flex flex-row items-center gap-x-5'>
                  {item.icon}
                  <span className='text-base text-gray-700'>{item.label}</span>
                </div>
                <input
                  type='checkbox'
                  id={item.id}
                  className='accent-primary h-4 w-4 cursor-pointer rounded border-gray-300'
                  checked={selectedTypes.has(item.id)}
                  onChange={() => {
                    setSelectedTypes((prev) => {
                      const newSet = new Set(prev)
                      if (newSet.has(item.id)) {
                        newSet.delete(item.id)
                      } else {
                        newSet.add(item.id)
                      }
                      return newSet
                    })
                  }}
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
