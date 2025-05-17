import React, { useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import StepItem from '@/components/onboarding/StepItem'
import StepContent from '@/components/onboarding/StepContent'
import Button from '@/components/common/Button'

import SentriaLogo from '@/assets/sentria-logo.svg?react'
import stepOneIcon from '@/assets/step-1.svg'
import stepTwoIcon from '@/assets/step-2.svg'
import stepThreeIcon from '@/assets/step-3.svg'
import stepFourIcon from '@/assets/step-4.svg'

// Step data structure
interface Step {
  id: number
  title: string
  content: string
  iconPath: string
}

const StepsScroller: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { t, i18n } = useTranslation()

  const steps: Step[] = [
    {
      id: 1,
      title: `${t('onboarding.title')}`,
      content: `${t('onboarding.intro')}`,

      iconPath: stepOneIcon,
    },
    {
      id: 2,
      title: `${t('onboarding.shareTitle')}`,
      content: `${t('onboarding.shareDescription')}`,
      iconPath: stepTwoIcon,
    },
    {
      id: 3,
      title: `${t('onboarding.helpTitle')}`,
      content: `${t('onboarding.helpDescription')}`,
      iconPath: stepThreeIcon,
    },
    {
      id: 4,
      title: `${t('onboarding.rebuildTitle')}`,
      content: `${t('onboarding.rebuildDescription')}`,
      iconPath: stepFourIcon,
    },
  ]

  // const changeLanguage = (lang: string) => {
  //   i18n.changeLanguage(lang)
  // }

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      // Find most visible step in the viewport

      const containerRect = scrollContainerRef.current.getBoundingClientRect()
      const containerCenter = containerRect.top + containerRect.height / 2 // get center

      let closestStepIndex = 0
      let minDistance = Infinity // largest number

      // Get all step elements
      const stepElements = Array.from(
        scrollContainerRef.current.querySelectorAll('.step-content'),
      )

      // find step box closet to center
      stepElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect()
        const stepCenter = rect.top + rect.height / 2
        const distance = Math.abs(stepCenter - containerCenter)

        if (distance < minDistance) {
          minDistance = distance
          closestStepIndex = index
        }
      })

      // Update active step
      const newActiveStep = closestStepIndex + 1
      if (newActiveStep !== activeStep) {
        setActiveStep(newActiveStep)
      }
    }
  }, [activeStep])

  // Scroll to a specific step
  const scrollToStep = useCallback((stepId: number) => {
    const stepElement = document.getElementById(`step-${stepId}`)
    if (stepElement && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: stepElement.offsetTop,
        behavior: 'smooth',
      })
      setActiveStep(stepId)
    }
  }, [])

  const handleStart = () => {
    alert('Navigate to dashboard')
    // navigate('/Home');
  }

  return (
    <div className='flex min-h-screen justify-center bg-white pl-30'>
      {/* Left step bar */}
      <div className='mt-8 flex w-1/2 flex-col p-8'>
        <div className='mb-16'>
          <h2 className='text-primary'>
            <SentriaLogo className={'h-16 w-60 object-contain'} />
          </h2>
        </div>

        {/* to test language change */}
        {/* <button onClick={() => changeLanguage('mm')} className={"bg-primary"}>Myanmar</button> */}

        <div className='flex-grow'>
          {steps.map((step) => (
            <StepItem
              key={step.id}
              id={step.id}
              title={step.title}
              isActive={activeStep >= step.id}
              isLast={step.id === steps.length}
              click={scrollToStep}
            />
          ))}
        </div>
      </div>

      {/* Right step content area with smooth scrolling */}
      <div
        ref={scrollContainerRef}
        className='custom-scrollbar flex h-screen w-1/2 flex-col overflow-y-auto scroll-smooth p-8 pb-40'
        onScroll={handleScroll}
      >
        {/* Content container */}
        <div className='flex flex-col space-y-7 pt-8'>
          {steps.map((step) => (
            <div
              key={step.id}
              id={`step-${step.id}`}
              className='step-content min-h-[60vh] snap-start'
            >
              <StepContent
                title={step.title}
                content={step.content}
                iconPath={step.iconPath}
                isActive={activeStep === step.id}
              />
            </div>
          ))}

          <div className=''>
            <Button
              onClick={handleStart}
              secondary={true}
              type={'button'}
              className='w-[560px] rounded-md px-10 py-2 text-white transition-colors hover:opacity-80'
            >
              {t('onboarding.startExploring')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StepsScroller
