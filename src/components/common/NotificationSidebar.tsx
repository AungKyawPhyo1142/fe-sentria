import { useSocketStore } from '@/zustand/socketStore'
import { formatDistanceToNow } from 'date-fns'

const NotificationSidebar = () => {
  const notifications = useSocketStore((state) => state.allEarthquakeAlerts)

  return (
    <div className='fixed top-[60px] right-0 z-50 h-[calc(100vh-100px)] w-[220px] overflow-y-auto rounded-[10px] border border-black/30 bg-white px-2 py-3'>
      <h2 className='mb-4 text-center text-lg font-bold'> Notifications</h2>
      {notifications.length === 0 && (
        <p className='text-sm text-black/30'>No Notifications</p>
      )}
      <ul className='space-y-3'>
        {notifications.map((noti, index) => {
          const timeAgo = formatDistanceToNow(new Date(noti.time), {
            addSuffix: true,
          })

          return (
            <li
              key={index}
              className='border-b border-black/30 px-1 pb-2 text-xs'
            >
              <div className='font-semibold text-black'>
                Found new {noti.magnitude}M Earthquake
              </div>
              <div className='text-black'>{noti.body}</div>
              <div className='text-[10px] text-black/30'>{timeAgo}</div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default NotificationSidebar
