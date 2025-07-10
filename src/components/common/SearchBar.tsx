import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const SearchBar = () => {
  const { t } = useTranslation()
  return (
    <div className='bg-primary flex h-12.5 w-50 content-center items-center justify-center space-x-2 rounded-xl text-center text-white'>
      <Search size={26} strokeWidth={1} className='hover:cursor-pointer' />
      <input
        type='text'
        className='w-36 bg-transparent text-[16px] font-extralight focus:ring-0 focus:outline-0'
        placeholder={t('sidebar.SearchPost')}
      />
    </div>
  )
}
export default SearchBar
