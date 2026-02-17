import { useTranslation } from 'react-i18next'
import CreatePostModal from './CreatePostModal'
import { CreateActivityFormValues } from '@/components/posts/ActivityPostModal'
import {
  ActivityType,
  CreateActivityRequest,
  HelpType,
  useCreateActivity,
} from '@/services/network/lib/activity'
import { Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { useLocation } from 'react-router'
import ActivityPostModal from '../posts/ActivityPostModal'

const pageTitleMap: Record<string, string> = {
  '/home': 'sidebar.Home',
  '/map': 'sidebar.Map',
  '/resources': 'sidebar.Resources',
  '/fav': 'sidebar.Favorites',
  '/profile': 'Profile',
}

const Navbar = () => {
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false)
  const [createPost, setCreatePost] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const { t } = useTranslation()
  const location = useLocation()
  const isMapPage = location.pathname === '/map'

  const createActivityMutation = useCreateActivity()

  const pageTitle: string = pageTitleMap[location.pathname]
    ? t(pageTitleMap[location.pathname] as never)
    : ''

  const handleActivitySubmit = (data: CreateActivityFormValues) => {
    if (!data.description?.trim()) {
      alert('Please provide a description for your activity.')
      return
    }

    if (!data.helpItems || data.helpItems.length === 0) {
      alert('Please select at least one type of help.')
      return
    }

    const apiData: CreateActivityRequest = {
      activityType:
        data.activityType === 'offer'
          ? ActivityType.OFFER
          : ActivityType.REQUEST,
      description: data.description.trim(),
      location: {
        city: data.city?.trim() || 'London',
        country: data.country?.trim() || 'United Kingdom',
        latitude: data.coordinates ? data.coordinates[0] : 51.5074,
        longitude: data.coordinates ? data.coordinates[1] : -0.1278,
      },
      helpItems: data.helpItems.map((helpType) => ({
        helpType: mapHelpTypeToHelpType(helpType),
        quantity: data.quantities[helpType] || null,
      })),
    }

    createActivityMutation.mutate(apiData, {
      onSuccess: (response) => {
        console.log('Activity created successfully from NavBar:', response)
        setIsActivityModalOpen(false)
      },
      onError: (error) => {
        console.error('Error creating activity from NavBar:', error)
        alert('Failed to create activity. Please try again.')
      },
    })
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
    <div className='fixed top-0 right-0 left-16 z-50 flex h-14 items-center justify-between bg-white/80 px-6 backdrop-blur-md'>
      {/* Left: Page title */}
      <div className='flex items-center gap-3'>
        <h1 className='text-[15px] font-semibold tracking-tight text-gray-800'>
          {pageTitle}
        </h1>
      </div>

      {/* Center: Search */}
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <div
          className={`flex h-9 items-center gap-2 rounded-full border bg-gray-50 px-3.5 transition-all duration-200 ${
            searchFocused
              ? 'border-primary/30 ring-primary/10 w-80 bg-white shadow-sm ring-2'
              : 'w-64 border-transparent hover:border-gray-200 hover:bg-white'
          }`}
        >
          <Search
            size={15}
            className='shrink-0 text-gray-400'
            strokeWidth={2}
          />
          <input
            type='text'
            placeholder='Search reports...'
            className='w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400'
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
      </div>

      {/* Right: Action button */}
      <div className='flex items-center gap-3'>
        {isMapPage ? (
          <button
            onClick={() => setIsActivityModalOpen(true)}
            className='bg-primary hover:bg-primary-dark flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-[13px] font-medium text-white shadow-sm transition-all duration-150 hover:shadow-md active:scale-[0.98]'
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>Need / Offer Help</span>
          </button>
        ) : (
          <button
            onClick={() => setCreatePost(true)}
            className='bg-primary hover:bg-primary-dark flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-[13px] font-medium text-white shadow-sm transition-all duration-150 hover:shadow-md active:scale-[0.98]'
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>{t('sidebar.ReportPost')}</span>
          </button>
        )}
      </div>

      {/* Modals */}
      {createPost && (
        <CreatePostModal isOpen={createPost} setIsOpen={setCreatePost} />
      )}

      <ActivityPostModal
        isOpen={isActivityModalOpen}
        setIsOpen={setIsActivityModalOpen}
        onSubmit={handleActivitySubmit}
      />
    </div>
  )
}

export default Navbar
