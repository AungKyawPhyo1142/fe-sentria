import ActivityPostCard from './ActivityPostCard'
import DropDown from '../common/DropDown'
import Input from '../common/Input'
import { ChevronDown, Droplets, HouseIcon, Utensils, Wifi } from 'lucide-react'
import { useState } from 'react'

const sampleActivityFeedPosts = [
  {
    id: '1',
    user: {
      name: 'Scarlett Johansson',
      avatar: null,
      isVerified: true,
    },
    location: 'London, UK',
    content:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English.',
    helpType: 'Offering Help' as const,
    offeredHelp: ['water', 'food', 'shelter'],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '2',
    user: {
      name: 'John Doe',
      avatar: null,
      isVerified: false,
    },
    location: 'Manchester, UK',
    content:
      'Urgent: Need assistance with temporary shelter for my family after the recent flooding. We have been displaced and are currently staying at a local community center.',
    helpType: 'Need Help' as const,
    offeredHelp: ['shelter'],
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: '3',
    user: {
      name: 'Emily Chen',
      avatar: null,
      isVerified: true,
    },
    location: 'Birmingham, UK',
    content:
      'Community kitchen set up at the local church. We are providing free meals and clean water for anyone affected by the recent storm. Open from 8 AM to 8 PM daily.',
    helpType: 'Offering Help' as const,
    offeredHelp: ['food', 'water'],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
]

export const ActivityFeed = () => {
  const [sortBy, setSortBy] = useState('latest')
  const [locationSearch, setLocationSearch] = useState('')
  const [selectedFilters, setSelectedFilters] = useState(
    new Set(['shelter', 'water', 'food', 'wifi']),
  )
  const [helpNeeded, setHelpNeeded] = useState(true)
  const [helpAvailable, setHelpAvailable] = useState(true)

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

  return (
    <div className='fade-in flex h-full w-full'>
      <div className='flex flex-1 flex-col overflow-y-auto'>
        <div className='mt-4 flex items-center justify-between gap-4 px-6 py-4'>
          <div className='flex flex-shrink-0 items-center gap-4'>
            <span className='text-[20px] font-extralight whitespace-nowrap text-black'>
              Sort by:
            </span>
            <div className='relative w-75 flex-shrink-0'>
              <DropDown
                className='min-h-[50px] w-full appearance-none'
                itemList={sortOptions.map(
                  (option) => option[0].toUpperCase() + option.slice(1),
                )}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                placeholder='Sort by'
              />
              <ChevronDown className='pointer-events-none absolute top-1/2 right-4 h-6 w-6 -translate-y-1/2 text-black' />
            </div>
          </div>
          <div className='max-w-md flex-1'>
            <Input
              showSearchIcon
              type='text'
              className='min-h-[50px] w-full border-r ps-11 text-[20px]'
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              placeholder='Location'
            />
          </div>
        </div>
        <div className='flex flex-col space-y-4 pt-6 pb-8'>
          {sampleActivityFeedPosts.map((post) => (
            <ActivityPostCard
              key={post.id}
              user={post.user}
              location={post.location}
              content={post.content}
              helpType={post.helpType}
              offeredHelp={post.offeredHelp}
              createdAt={post.createdAt}
            />
          ))}
        </div>
      </div>

      <div className='w-80 border-l border-[#33333430] p-6'>
        <div className='flex flex-col gap-y-5'>
          <div className='mt-4 flex w-full flex-col gap-y-4 rounded-lg border border-[#33333430] p-4'>
            <h2 className='text-lg font-light text-[#3333344d]'>Filter by</h2>
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
    </div>
  )
}
