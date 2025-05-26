import { useEffect, useState } from 'react'

interface CheckCircleAnimatedProps {
  setAnimationComplete: (value: boolean) => void
  animationDuration?: number
}

function CheckCircleAnimated({
  setAnimationComplete,
  animationDuration = 3000,
}: CheckCircleAnimatedProps) {
  const [animationStarted, setAnimationStarted] = useState(false)

  useEffect(() => {
    // Small delay before starting animation
    const startTimer = setTimeout(() => {
      setAnimationStarted(true)
    }, 300)

    // Notify parent when animation completes
    const completeTimer = setTimeout(() => {
      setAnimationComplete(true)
    }, animationDuration + 300)

    return () => {
      clearTimeout(startTimer)
      clearTimeout(completeTimer)
    }
  }, [animationDuration, setAnimationComplete])

  return (
    <div className='relative flex items-center justify-center'>
      <svg
        width='100'
        height='100'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='0.5'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={`text-primary ${animationStarted ? 'animate-check' : 'scale-0 opacity-0'}`}
      >
        <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' className='circle-path' />
        <path d='m9 11 3 3L22 4' className='check-path' />
      </svg>
      <style>{`
        .animate-check {
          animation: scaleIn 0.3s ease-out 0.2s forwards;
        }

        .circle-path {
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          opacity: 0.3;
          animation:
            drawCircle ${animationDuration * 0.7}ms ease-out 0.5s forwards,
            brighten ${animationDuration * 0.7}ms ease-out 0.5s forwards;
        }

        .check-path {
          stroke-dasharray: 24;
          stroke-dashoffset: 24;
          opacity: 0.3;
          animation:
            drawCheck ${animationDuration * 0.5}ms ease-out
              ${animationDuration * 0.4}ms forwards,
            brighten ${animationDuration * 0.5}ms ease-out
              ${animationDuration * 0.4}ms forwards;
        }

        @keyframes scaleIn {
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes drawCircle {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes drawCheck {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes brighten {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default CheckCircleAnimated
