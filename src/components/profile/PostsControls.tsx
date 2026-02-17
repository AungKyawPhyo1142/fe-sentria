import { ChevronDown } from 'lucide-react'
interface PostControlsProps {
  sortBy: string
  setSortBy: (sort: string) => void
  filterBy: string
  setFilterBy: (filter: string) => void
  isVerified: boolean
}

export default function PostsControls({
  sortBy,
  setSortBy,
  filterBy,
  setFilterBy,
  isVerified,
}: PostControlsProps) {
  return (
    <div className='mb-4 flex items-center justify-between px-1'>
      <div className='flex items-center space-x-4'>
        <label htmlFor='sort' className='text-xl font-normal text-gray-900'>
          Sort by:
        </label>
        <div className='relative'>
          <select
            id='sort'
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className='h-12 w-75 appearance-none rounded border border-gray-300 px-3 py-3 pr-10 text-base font-medium text-gray-900'
          >
            <option value='recent'>Latest</option>
            <option value='popular'>Popular</option>
          </select>
          <ChevronDown className='pointer-events-none absolute top-1/2 right-4 h-6 w-6 -translate-y-1/2 text-gray-900' />
        </div>
      </div>
      <div className='flex items-center space-x-4'>
        <label htmlFor='filter' className='text-xl font-normal text-gray-900'>
          Filter by:
        </label>
        <div className='relative'>
          <select
            id='filter'
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className='h-12 w-75 appearance-none rounded border border-gray-300 px-3 py-3 pr-10 text-base font-medium text-gray-900'
          >
            <option value='all'>All</option>
            <option value='activity'>Activity Feed</option>
            <option value='incidents'>Disaster Incidents</option>
            {isVerified && <option value='resources'>Resources</option>}
          </select>
          <ChevronDown className='pointer-events-none absolute top-1/2 right-4 h-6 w-6 -translate-y-1/2 text-gray-900' />
        </div>
      </div>
    </div>
  )
}
