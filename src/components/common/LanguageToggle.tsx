import i18next from 'i18next'
import Button from './Button'
const LanguageToggle = () => {
  const changeLanguage = (lng: string) => {
    i18next.changeLanguage(lng)
  }
  return (
    <div>
      <div>
        <Button primary onClick={() => changeLanguage('mm')}>
          mm
        </Button>
        <Button secondary onClick={() => changeLanguage('en')}>
          en
        </Button>
      </div>
    </div>
  )
}

export default LanguageToggle
