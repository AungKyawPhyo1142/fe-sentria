import React from 'react'
import ActivityFeedModal from './ActivityPostModal'
import {
  useCreateActivity,
  useUpdateActivity,
  Activity,
  ActivityType,
  CreateActivityRequest,
  UpdateActivityRequest,
  HelpType,
} from '@/services/network/lib/activity'

import { CreateActivityFormValues } from './ActivityPostModal'

interface ActivityModalWithAPIProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  editActivity?: Activity | null
}

const ActivityModalWithAPI: React.FC<ActivityModalWithAPIProps> = ({
  isOpen,
  setIsOpen,
  editActivity,
}) => {
  const createActivityMutation = useCreateActivity()
  const updateActivityMutation = useUpdateActivity(editActivity?.id || '')

  const getInitialFormData = ():
    | Partial<CreateActivityFormValues>
    | undefined => {
    if (!editActivity) return undefined

    return {
      activityType: editActivity.activityType === 'OFFER' ? 'offer' : 'request',
      helpItems: editActivity.helpItems.map((item) =>
        item.helpType.toLowerCase(),
      ),
      quantities: editActivity.helpItems.reduce(
        (acc, item) => {
          if (item.quantity) {
            acc[item.helpType.toLowerCase()] = item.quantity
          }
          return acc
        },
        {} as { [key: string]: number },
      ),
      description: editActivity.description,
      city: editActivity.city,
      country: editActivity.country,
      coordinates: [editActivity.latitude, editActivity.longitude] as [
        number,
        number,
      ],
    }
  }

  const handleSubmit = (data: CreateActivityFormValues) => {
    console.log('Form submitted with data:', data)

    const apiData: CreateActivityRequest = {
      activityType:
        data.activityType === 'offer'
          ? ActivityType.OFFER
          : ActivityType.REQUEST,
      description: data.description.trim(),
      location: {
        city: data.city?.trim() || 'London', // Default to London if no city provided
        country: data.country?.trim() || 'United Kingdom', // Default to UK if no country provided
        latitude: data.coordinates ? data.coordinates[0] : 51.5074, // London coordinates as default
        longitude: data.coordinates ? data.coordinates[1] : -0.1278,
      },
      helpItems: data.helpItems.map((helpType) => ({
        helpType: mapHelpTypeToHelpType(helpType),
        quantity: data.quantities[helpType] || null,
      })),
    }

    if (editActivity) {
      const updateData: UpdateActivityRequest = apiData
      updateActivityMutation.mutate(updateData, {
        onSuccess: (response) => {
          console.log('Activity updated successfully:', response)
          setIsOpen(false)
        },
        onError: (error) => {
          console.error('Error updating activity:', error)
          alert('Failed to update activity. Please try again.')
        },
      })
    } else {
      createActivityMutation.mutate(apiData, {
        onSuccess: (response) => {
          console.log('Activity created successfully:', response)
          setIsOpen(false)
        },
        onError: (error) => {
          console.error('Error creating activity:', error)
          alert('Failed to create activity. Please try again.')
        },
      })
    }
  }

  const mapHelpTypeToHelpType = (helpType: string): HelpType => {
    switch (helpType.toLowerCase()) {
      case 'food':
        return HelpType.FOOD
      case 'water':
        return HelpType.WATER
      case 'shelter':
        return HelpType.SHELTER
      case 'wifi':
        return HelpType.WIFI
      default:
        return HelpType.FOOD
    }
  }

  return (
    <ActivityFeedModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onSubmit={handleSubmit}
      initialData={getInitialFormData()}
    />
  )
}

export default ActivityModalWithAPI
