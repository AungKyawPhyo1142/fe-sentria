import { useGetAllDisasterReports } from '@/services/network/lib/disasterReport'
import { useReportWebSocket } from '@/services/socketio/hooks/useReportWebSocket'
import {
  UserLocation,
  useSendLocationWebSocket,
} from '@/services/socketio/hooks/useSendLocationWebSocket'
// import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

const WebSocketExample = () => {
  const {
    data: reportData,
    // isLoading,
    // isError,
    fetchNextPage,
    // isFetchingNextPage,
  } = useGetAllDisasterReports()

  const reportSocketCleanup = useReportWebSocket(reportData?.pages)

  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)

  // 1. Grab geolocation once on mount
  useEffect(() => {
    // navigator.geolocation.getCurrentPosition(
    //   (position) => {
    //     setUserLocation({
    //       lat: position.coords.latitude,
    //       lng: position.coords.longitude,
    //     })
    //   },
    //   (err) => console.error("Geolocation failed:", err),
    //   { enableHighAccuracy: true }
    // )

    // this is a mock location for testing purposes
    // you can replace this with the above geolocation code when testing in a real environment
    setUserLocation({
      lat: 16.0544,
      lng: 108.2022,
    })
  }, [])

  // 2. Use the WebSocket hook once we have a location
  // useEffect(() => {
  //   if (!userLocation) return

  //   const disconnect = useSendLocationWebSocket(userLocation)

  //   return () => {
  //     disconnect()
  //   }
  // }, [userLocation])
  // 2. Use the WebSocket hook once we have a location
  const disconnect = userLocation
    ? useSendLocationWebSocket(userLocation)
    : () => {}

  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  // * Cleanup
  useEffect(() => reportSocketCleanup, [reportSocketCleanup])

  const handleScroll = () => {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      fetchNextPage()
    }
  }

  // Scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return (
    <>
      <div>
        {userLocation ? (
          <p>
            📍 You’re at: {userLocation.lat}, {userLocation.lng}
          </p>
        ) : (
          <p>📡 Locating you...</p>
        )}
      </div>
      <div>
        {reportData?.pages.map((page, index) => (
          <div key={index} className='grid grid-cols-3 gap-4'>
            {page.data.reports.data.map((report) => (
              <div
                key={report._id}
                className='m-5 flex flex-col border bg-blue-200 p-5'
              >
                <span className='text-red-400'>ID: {report._id}</span>
                <br />
                {report.name}
                <div>
                  OverallPercentage: {report.factCheck.overallPercentage} |{' '}
                  {report.factCheck.overallPercentage !== undefined &&
                  report.factCheck.overallPercentage !== null
                    ? `${report.factCheck.overallPercentage}%`
                    : 'NO'}
                </div>
                <div className='flex flex-col'>
                  <div>Severity: {report.severity}</div>
                  <div>IncidentType: {report.incidentType}</div>
                  <div>Location: {report.location.country}</div>
                  <div>
                    FactCheckStatus: {report.factCheck.goService.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

export default WebSocketExample
