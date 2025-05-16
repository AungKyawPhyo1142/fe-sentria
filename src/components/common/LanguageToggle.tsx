import i18next from 'i18next'
import Button from './Button'
import { useState } from 'react'
import { Globe, ChevronDown, ChevronUp } from 'lucide-react'

const LanguageToggle = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState<'en' | 'mm'>(
    i18next.language as 'en' | 'mm',
  )
  const changeLanguage = (lng: 'en' | 'mm') => {
    i18next.changeLanguage(lng)
    setCurrentLang(lng)
    setIsOpen(false)
  }

  return (
    <div className='relative inline-block text-left'>
      {/* <div>
        <Button primary onClick={() => changeLanguage('mm')}>mm</Button>
        <Button secondary onClick={() => changeLanguage('en')}>en</Button>
        
      </div> */}
      <Button
        outline
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-1 rounded-l-full rounded-r-full px-2 text-[14px] py-1 '
      >
        <Globe size={25} className='pr-1' />
        <span className='capitalize'>
          {currentLang === 'en' ? 'English' : 'Myanmar'}
        </span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </Button>
      {isOpen && (
        <div className='border-secondary text-secondary absolute z-10 m-1 rounded-lg border bg-white px-2 shadow-lg'>
          <button
            className='block w-full px-5 py-2 text-left hover:cursor-pointer hover:underline'
            onClick={() => changeLanguage('en')}
          >
            English
          </button>
          <button
            className='block w-full px-5 py-2 text-left hover:cursor-pointer hover:underline'
            onClick={() => changeLanguage('mm')}
          >
            Myanmar
          </button>
        </div>
      )}
    </div>
  )
}

export default LanguageToggle
