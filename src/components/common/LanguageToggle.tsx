import i18next from 'i18next'
import { useState } from 'react'
import MnFlag from '@/assets/MnFlag.png'
import EnFlag from '@/assets/EnFlag.png'

const LanguageToggle = () => {
  const [currentLang, setCurrentLang] = useState<'en' | 'mm'>(
    i18next.language as 'en' | 'mm',
  )
  const changeLanguage = (lng: 'en' | 'mm') => {
    i18next.changeLanguage(lng)
    setCurrentLang(lng)
  }
  const isEnglish = currentLang === 'en'

  const toggleLanguage = () => {
    changeLanguage(isEnglish ? 'mm' : 'en')
  }
  return (
    <div className='flex items-center justify-center'>
      <div
        role='button'
        onClick={toggleLanguage}
        className='border-secondary relative flex h-10 w-22 cursor-pointer items-center rounded-[10px] border transition-colors select-none focus:outline-none'
      >
        {/* MN Text - shown on right when MN is active */}
        {!isEnglish && (
          <span className='text-secondary absolute right-3 text-lg font-semibold'>
            MM
          </span>
        )}

        {/* EN Text - shown on left when EN is active */}
        {isEnglish && (
          <span className='text-secondary absolute left-3 text-lg font-semibold'>
            EN
          </span>
        )}

        {/* Toggle knob with flag */}
        <div
          className={`flex h-10 w-10 transform items-center justify-center rounded-[10px] transition-transform duration-300 ${
            isEnglish ? 'translate-x-12' : 'translate-x-0'
          }`}
        >
          <img
            src={isEnglish ? EnFlag : MnFlag}
            alt='Flag'
            className='border-secondary h-8 w-8 rounded-[10px] border-2 object-cover'
          />
        </div>
      </div>
    </div>
  )
}

export default LanguageToggle
