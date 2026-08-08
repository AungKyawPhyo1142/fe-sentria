import SearchInput from '@/components/common/SearchInput'
import { FavFeed } from '@/components/posts/FavFeed'
import { FavResource } from '@/components/posts/FavResource'
import { useState } from 'react'

const FavPage = () => {
  const [page, setPage] = useState(1)
  const postType = [
    { id: 1, label: 'Activity Feed', component: <FavFeed /> },
    { id: 2, label: 'Resources', component: <FavResource /> },
  ]
  return (
    <div className='fade-in flex h-screen flex-col items-center justify-start'>
      <div className='flex w-full flex-row items-center justify-between'>
        {/* tab buttons */}
        <div className='flex w-2xl flex-row items-center justify-between gap-x-5 rounded-lg bg-[#3333340e] p-2'>
          {postType.map((item) => (
            <button
              key={item.id}
              name={item.label}
              className={`min-h-[30px] w-full cursor-pointer rounded-lg border py-2 text-base font-light transition-all duration-200 ease-in-out hover:opacity-[90%] active:opacity-100 ${
                page === item.id
                  ? 'border-[#33333430] bg-white text-black'
                  : 'border-none text-gray-400 hover:bg-gray-200 hover:text-black'
              }`}
              onClick={() => setPage(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        {/* search bar */}
        <div className='flex justify-end'>
          <SearchInput />
        </div>
      </div>

      {/* scrollable content */}
      <div className='w-full flex-1 overflow-y-auto py-4'>
        {postType.find((item) => item.id === page)?.component}
      </div>
    </div>
  )
}
export default FavPage
