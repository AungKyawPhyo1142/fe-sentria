import DropDown from '@/components/common/DropDown'
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
} from '@/services/network/lib/user'
import { selectAuth, useAuthStore } from '@/zustand/authStore'
import {
  BriefcaseMedical,
  CirclePlus,
  FlameKindling,
  PhoneCall,
} from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ResourcePage() {
  const [resources, setResources] = useState<Resource[] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userProfiles, setUserProfiles] = useState<UserProfileMap>({})

  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest')

  const { userId: currentUserId } = useAuthStore(selectAuth)

  const { data: resourcesData, isLoading: resourcesLoading } = useGetResources()

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
      if (selectedTypes.size === 0) return true
      return selectedTypes.has(resource.resourceType || '')
    })
    ?.sort((a, b) => {
      const timeA = new Date(a.resourceTimestamp).getTime()
      const timeB = new Date(b.resourceTimestamp).getTime()

      return sortOrder === 'latest' ? timeB - timeA : timeA - timeB
    })

  const sortOptions = new Map<string, string>([
    ['latest', 'Latest'],
    ['oldest', 'Oldest'],
  ])

  return (
    <div className='flex w-full items-start gap-6 p-6'>
      {/* resources */}
      <div className='flex w-full flex-col items-center justify-center'>
        <div className='mb-4 flex w-full items-center justify-between'>
          <div className='flex w-fit items-center'>
            <span className='w-full'>Sort by:</span>
            <DropDown
              className='ml-10 !w-[150px]'
              id='sort'
              name='sort'
              itemList={sortOptions}
              onChange={(e) =>
                setSortOrder(e.target.value as 'latest' | 'oldest')
              }
              value={sortOrder}
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className='bg-primary flex h-12.5 items-center justify-center rounded-xl px-4 py-1 font-light text-white hover:cursor-pointer'
          >
            <CirclePlus size={26} strokeWidth={1} />
            <span className='ml-3 text-[16px]'>Create a resource</span>
          </button>
        </div>

        {/* Resource List */}

        {/* Resource Cards */}
        <div className='mt-6 flex w-full flex-col items-center gap-y-4'>
          {resourcesLoading && (
            <div className='py-10 text-center text-gray-500'>
              Loading resources...
            </div>
          )}

          {!resourcesLoading && resources?.length === 0 && (
            <div className='py-10 text-center text-gray-500'>
              No resources found. Create your first resource!
            </div>
          )}

          {filteredResources?.map((resource, index) => (
            <ResourceCard
              key={resource._id || index}
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
      <div className='flex w-2/6 flex-col items-center justify-center gap-y-5'>
        <div className='flex w-full flex-col gap-y-4 rounded-lg border border-[#33333430] p-4'>
          <h2 className='text-lg font-light text-[#3333344d]'>Filter by</h2>
          <hr className='mb-1 border-t border-[#33333430]' />
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
