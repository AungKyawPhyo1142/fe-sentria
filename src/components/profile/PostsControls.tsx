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
        <label
          htmlFor='sort'
          className='text-[20px] font-extralight text-black'
        >
          Sort by:
        </label>
        <select
          id='sort'
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className='py-3text-[16px] h-12 w-75 rounded border border-black px-3 font-medium text-black'
        >
          <option value='recent'>Latest</option>
          <option value='popular'>Popular</option>
        </select>
      </div>
      <div className='flex items-center space-x-4'>
        <label
          htmlFor='filter'
          className='text-[20px] font-extralight text-black'
        >
          Filter by:
        </label>
        <select
          id='filter'
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className='h-12 w-75 rounded border border-black px-3 py-3 text-[16px] font-medium text-black'
        >
          <option value='all'>All</option>
          <option value='activity'>Activity Feed</option>
          <option value='incidents'>Disaster Incidents</option>
          {isVerified && <option value='resources'>Resources</option>}
        </select>
      </div>
    </div>
  )
}
