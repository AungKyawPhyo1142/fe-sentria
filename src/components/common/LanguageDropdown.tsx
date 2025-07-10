import { useState, useRef, useEffect } from 'react'
import i18next from 'i18next'
import { Languages } from 'lucide-react'
import { useLocation } from 'react-router'

const LanguageDropdown = () => {
  const [open, setOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState<'en' | 'mm'>(
    i18next.language as 'en' | 'mm',
  )

  const toggleDropdown = () => setOpen((prev) => !prev)

  const changeLanguage = (lang: 'en' | 'mm') => {
    i18next.changeLanguage(lang)
    setCurrentLang(lang)
    setOpen(false)
  }

  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  const location = useLocation()
  const isMapPage = location.pathname === '/map'
  const displayText = currentLang === 'en' ? 'English' : 'Burmese'

  return (
    <div className='relative' ref={dropdownRef}>
      {/* Button */}
      <button
        onClick={toggleDropdown}
        className='flex items-center gap-2 rounded-[10px] py-2 text-[16px] transition-colors hover:cursor-pointer'
      >
        <Languages />
        {!isMapPage && <span>{displayText}</span>}
      </button>

      {/* Dropdown */}
      {open && (
        <div className='animate-fade-in absolute bottom-full mb-2 w-35 rounded-[10px] border border-gray-300 bg-white shadow-lg transition-all'>
          <ul className='text-[16px]'>
            <li
              onClick={() => changeLanguage('en')}
              className='cursor-pointer rounded-t-[10px] px-4 py-2 hover:bg-gray-100'
            >
              English
            </li>
            <li
              onClick={() => changeLanguage('mm')}
              className='cursor-pointer rounded-b-[10px] px-4 py-2 hover:bg-gray-100'
            >
              Burmese
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default LanguageDropdown
