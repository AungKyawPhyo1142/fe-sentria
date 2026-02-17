import { Search } from 'lucide-react'
import { useState } from 'react'

const SearchInput = () => {
  const [focused, setFocused] = useState(false)

  return (
    <div
      className={`flex h-9 items-center gap-2 rounded-full border bg-gray-50 px-3.5 transition-all duration-200 ${
        focused
          ? 'border-primary/30 ring-primary/10 w-80 bg-white shadow-sm ring-2'
          : 'w-64 border-transparent hover:border-gray-200 hover:bg-white'
      }`}
    >
      <Search size={15} className='shrink-0 text-gray-400' strokeWidth={2} />
      <input
        type='text'
        placeholder='Search reports...'
        className='w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400'
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  )
}

export default SearchInput
