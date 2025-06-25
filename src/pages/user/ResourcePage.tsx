import CreateResourceModal from '@/components/resources/CreateResourceModal'
import ResourceCard from '@/components/resources/ResourceCard'
import { useState, useEffect } from 'react'
import {
  useCreateResource,
  useGetResources,
  Resource,
  CreateResourceFormValuesWithFiles,
} from '@/services/network/lib/resources'
import { selectAuth, useAuthStore } from '@/zustand/authStore'
import {
  UserProfileMap,
  useBatchUserProfiles,
} from '@/services/network/lib/user'

export default function ResourcePage() {
  const [resources, setResources] = useState<Resource[] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userProfiles, setUserProfiles] = useState<UserProfileMap>({})

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

  return (
    <div className='p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Resources</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className='rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
        >
          Create New Resource
        </button>
      </div>

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

        {resources?.map((resource, index) => (
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
            resourceTypes={resource.resourceType ? [resource.resourceType] : []}
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
  )
}
