import { useState, useRef, useEffect } from 'react'
import i18next from 'i18next'
import { Globe } from 'lucide-react'

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

  const displayText = currentLang === 'en' ? 'EN' : 'MM'

  return (
    <div className='relative' ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-gray-400 transition-all duration-150 hover:bg-gray-100 hover:text-gray-600'
      >
        <Globe size={20} strokeWidth={1.5} />
      </button>

      {open && (
        <div className='animate-fade-in absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-xl bg-white shadow-[var(--shadow-elevated)]'>
          <ul className='py-1'>
            <li
              onClick={() => changeLanguage('en')}
              className={`cursor-pointer px-4 py-2 text-sm transition-colors duration-100 hover:bg-gray-50 ${
                currentLang === 'en'
                  ? 'text-primary font-medium'
                  : 'text-gray-600'
              }`}
            >
              English
            </li>
            <li
              onClick={() => changeLanguage('mm')}
              className={`cursor-pointer px-4 py-2 text-sm transition-colors duration-100 hover:bg-gray-50 ${
                currentLang === 'mm'
                  ? 'text-primary font-medium'
                  : 'text-gray-600'
              }`}
            >
              Myanmar
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default LanguageDropdown
