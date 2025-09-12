// src/components/NotificationManager.tsx
import { useSocketStore } from '@/zustand/socketStore'; // Adjust path
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const NotificationManager = () => {
  // This component subscribes to the part of the Zustand store that holds the notification data.
  const { allEarthquakeAlerts, clearLatestEarthquakeAlert } = useSocketStore()

  useEffect(() => {
    // This log confirms the effect is running when the component mounts
    console.log('[NotificationManager] Effect is active.')

    // This effect runs ONLY when latestNotification changes from null to an object.
    if (allEarthquakeAlerts.length > 0) {
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

      // Now, we call toast() from inside a React component's lifecycle.
      toast(
        // It's safer to create the element outside the function call
        <div>
          <strong>
            {title} (M{magnitude.toFixed(1)})
          </strong>
          <p style={{ margin: '8px 0 0 0' }}>{body}</p>
          {url && (
            <a
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              style={{ color: '#3498db', textDecoration: 'underline' }}
            >
              View Details on USGS
            </a>
          )}
        </div>,
        {
          position: 'top-right',
          autoClose: 20000, // 20 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'light',
          // When the toast is closed (either by user or autoClose), clear the state
          onClose: () => clearLatestEarthquakeAlert(),
        },
      )
    } else {
      console.log(allEarthquakeAlerts)
    }
  }, [allEarthquakeAlerts, clearLatestEarthquakeAlert])

  // This component is purely for logic and does not render any UI itself.
  return null
}

export default NotificationManager
