import { useSocketStore } from '@/zustand/socketStore'
import { formatDistanceToNow } from 'date-fns'
import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'

const NotificationSidebar = () => {
  const notifications = useSocketStore((state) => state.allEarthquakeAlerts)
  const [dismissed, setDismissed] = useState<Set<number>>(new Set())

  const visibleNotifications = notifications.filter((_, i) => !dismissed.has(i))

  if (visibleNotifications.length === 0) return null

  return (
    <div className='fixed top-20 right-6 z-40 w-72'>
      <div className='rounded-2xl bg-white p-4 shadow-[var(--shadow-elevated)]'>
        <h3 className='mb-3 flex items-center gap-2 text-[13px] font-semibold text-gray-800'>
          <AlertTriangle size={14} className='text-warning' />
          Alerts
          <span className='bg-warning/10 text-warning ml-auto rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums'>
            {visibleNotifications.length}
          </span>
        </h3>

        <div className='custom-scrollbar max-h-[50vh] space-y-2 overflow-y-auto'>
          {notifications.map((noti, index) => {
            if (dismissed.has(index)) return null
            const timeAgo = formatDistanceToNow(new Date(noti.time), {
              addSuffix: true,
            })

            return (
              <div
                key={index}
                className='group relative rounded-xl border border-gray-100 bg-gray-50 p-3 transition-colors duration-150 hover:bg-white hover:shadow-sm'
              >
                <button
                  onClick={() =>
                    setDismissed((prev) => new Set([...prev, index]))
                  }
                  className='absolute top-2 right-2 cursor-pointer rounded-full p-0.5 text-gray-300 opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:bg-gray-100 hover:text-gray-500'
                >
                  <X size={12} />
                </button>
                <p className='text-[13px] font-medium text-gray-800'>
                  {noti.magnitude}M Earthquake
                </p>
                <p className='mt-0.5 text-[12px] leading-snug text-gray-500'>
                  {noti.body}
                </p>
                <p className='mt-1.5 text-[11px] text-gray-400'>{timeAgo}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default NotificationSidebar
