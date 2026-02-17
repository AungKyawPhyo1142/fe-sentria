import CreateResourceModal from '@/components/resources/CreateResourceModal'
import ResourceCard, {
  ResourceCardSkeleton,
} from '@/components/resources/ResourceCard'
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
import { BriefcaseMedical, FlameKindling, PhoneCall, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import NoDataStatement from '../common/NoDataStatement'
import ErrorFetch from '../common/ErrorFetch'

const FILTER_OPTIONS = [
  { label: 'Survival', id: 'SURVIVAL', icon: FlameKindling },
  { label: 'Hotline', id: 'HOTLINE', icon: PhoneCall },
  { label: 'First Aid', id: 'FIRST_AID', icon: BriefcaseMedical },
] as const

export default function ResourcePage() {
  const [resources, setResources] = useState<Resource[] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userProfiles, setUserProfiles] = useState<UserProfileMap>({})

  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(
    new Set(['SURVIVAL', 'HOTLINE', 'FIRST_AID']),
  )

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

  useEffect(() => {
    if (userProfilesFetched && batchUserProfiles) {
      setUserProfiles(batchUserProfiles)
    }
  }, [batchUserProfiles, userProfilesFetched])

  const createResourceMutation = useCreateResource()

  const handleSaveResource = (
    resourceData: CreateResourceFormValuesWithFiles,
  ) => {
    createResourceMutation.mutate(resourceData, {
      onSuccess: () => {
        setIsModalOpen(false)
      },
      onError: (error) => {
        console.error('Error creating resource:', error)
      },
    })
  }

  const getUserDisplayInfo = (userId: number) => {
    if (!userId) {
      return { name: 'Unknown User', avatar: null, isVerified: false }
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

  const toggleFilter = (id: string) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const filteredResources = resources
    ?.filter((resource) => {
      if (selectedTypes.size === 0) return true
      return selectedTypes.has(resource.resourceType || '')
    })
    ?.sort((a, b) => {
      const timeA = new Date(a.resourceTimestamp).getTime()
      const timeB = new Date(b.resourceTimestamp).getTime()
      return timeB - timeA
    })

  if (error) {
    return (
      <ErrorFetch
        heading='Try Again!'
        subHeading="There's an error fetching resources. Please try again!"
        reFetch={refetch}
      />
    )
  }

  return (
    <div className='fade-in'>
      <div className='mx-auto max-w-[640px]'>
        {/* Toolbar: filter pills + create button */}
        <div className='mb-5 flex items-center justify-between'>
          {/* Filter pills */}
          <div className='flex items-center gap-2'>
            {FILTER_OPTIONS.map(({ label, id, icon: Icon }) => {
              const isActive = selectedTypes.has(id)
              return (
                <button
                  key={id}
                  onClick={() => toggleFilter(id)}
                  className={`flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[12px] font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-primary/8 text-primary ring-primary/15 ring-1'
                      : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-500'
                  }`}
                >
                  <Icon size={13} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{label}</span>
                </button>
              )
            })}
          </div>

          {/* Create button */}
          {isVerified ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className='bg-primary hover:bg-primary-dark flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-[13px] font-medium text-white shadow-sm transition-all duration-150 hover:shadow-md active:scale-[0.98]'
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>Create Resource</span>
            </button>
          ) : (
            <span className='text-[12px] text-gray-400'>
              Verify profile to create
            </span>
          )}
        </div>

        {/* Resource list */}
        <div className='space-y-4'>
          {resourcesLoading && (
            <>
              {[...Array(3)].map((_, i) => (
                <ResourceCardSkeleton key={i} />
              ))}
            </>
          )}

          {!resourcesLoading && resources?.length === 0 && (
            <NoDataStatement
              heading='No Resources Yet'
              subHeading='Start by adding your first resource to help your community.'
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
              createdAt={new Date(resource.resourceTimestamp)}
              onReadMore={() => console.log('View full resource', resource)}
            />
          ))}
        </div>

        {/* Create modal */}
        <CreateResourceModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          onSave={handleSaveResource}
        />
      </div>
    </div>
  )
}
