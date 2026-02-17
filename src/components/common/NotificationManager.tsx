import '@/index.css'
import { useSocketStore } from '@/zustand/socketStore' // Adjust path
import { useEffect, useRef } from 'react'
import { toast } from '@/lib/toast'
import { ExternalLink } from 'lucide-react'

const NotificationManager = () => {
  // This component subscribes to the part of the Zustand store that holds the notification data.
  const { allEarthquakeAlerts, clearLatestEarthquakeAlert } = useSocketStore()

  // Track if this is the initial mount to prevent showing toasts on refresh
  const isInitialMount = useRef(true)
  const previousAlertsLength = useRef(0)

  useEffect(() => {
    // This log confirms the effect is running when the component mounts
    console.log('[NotificationManager] Effect is active.')

    // On initial mount, just store the current alerts length and don't show toasts
    if (isInitialMount.current) {
      previousAlertsLength.current = allEarthquakeAlerts.length
      isInitialMount.current = false
      console.log(
        '[NotificationManager] Initial mount - stored existing alerts count:',
        previousAlertsLength.current,
      )
      return
    }

    // Only show toast if we have MORE alerts than before (new notification received)
    if (allEarthquakeAlerts.length > previousAlertsLength.current) {
      const latestAlert = allEarthquakeAlerts[0] // Assuming the latest alert is at index 0
      const {
        title = latestAlert.title || 'Earthquake Alert',
        body = latestAlert.body || 'An earthquake has been detected.',
        magnitude = latestAlert.magnitude || 0,
        url = latestAlert.url || '',
      } = latestAlert

      console.log(
        '[NotificationManager] New notification detected, attempting to show toast for:',
        title,
      )

      // Show earthquake alert toast using sonner
      toast.warning(`${title} (M${magnitude.toFixed(1)})`, {
        description: url ? (
          <div>
            <p>{body}</p>
            <a
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-info hover:text-info/80 mt-1.5 inline-flex items-center gap-1 text-[12px] font-medium transition-colors'
            >
              View on USGS
              <ExternalLink size={11} />
            </a>
          </div>
        ) : (
          body
        ),
        duration: 20000,
        onDismiss: () => clearLatestEarthquakeAlert(),
        onAutoClose: () => clearLatestEarthquakeAlert(),
      })

      // Update the previous alerts length
      previousAlertsLength.current = allEarthquakeAlerts.length
    } else {
      console.log(
        '[NotificationManager] No new alerts to show. Current alerts:',
        allEarthquakeAlerts.length,
      )
    }
  }, [allEarthquakeAlerts, clearLatestEarthquakeAlert])

  // This component is purely for logic and does not render any UI itself.
  return null
}

export default NotificationManager
