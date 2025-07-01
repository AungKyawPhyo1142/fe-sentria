import Button from '@/components/common/Button'
import { useGetAllDisasterReports } from '@/services/network/lib/reports'
import { useSocketStore } from '@/zustand/socketStore'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

const SocketExample = () => {
  // ** setup queryClient and connect to socket
  const {
    connect,
    setupReportUpdateListener,
    subscribeToReportsRoom,
    sendUserLocation,
    earthquakeAlertListener,
  } = useSocketStore()
  const queryClient = useQueryClient()

  const isSocketConnected = useSocketStore((state) => state.isConnected)
  // const sendUserLocation = useSocketStore((state) => state.sendUserLocation)

  const { data: reportData, fetchNextPage } = useGetAllDisasterReports()

  useEffect(() => {
    // Establish connection and set up listeners on component mount
    connect()
    setupReportUpdateListener(queryClient)
    subscribeToReportsRoom(reportData?.pages ?? [])
    earthquakeAlertListener()
  }, [connect, setupReportUpdateListener, queryClient, reportData])

  // send user location to socket
  // TODO: put this in layout file since we have to send locatino to backend once user logged in
  useEffect(() => {
    if (isSocketConnected) {
      // navigator.geolocation.getCurrentPosition(position => {
      //     sendUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      // });

      // test for backend
      sendUserLocation({
        lat: 16.85,
        lng: 96.15,
      })
    }
  }, [isSocketConnected])

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
  }, [])

  return (
    <div className='flex flex-col gap-y-10 p-10'>
      <h1 className='text-xl'>
        Live Connection Status:
        {isSocketConnected ? '✅ Connected' : '❌ Disconnected'}
      </h1>
      <div>
        <Button primary onClick={() => toast('Hi')}>
          Toast
        </Button>
        <div>
          {reportData?.pages.map((page, index) => (
            <div key={index} className='grid grid-cols-3 gap-4'>
              {page.data.reports.data.map((report) => (
                <div
                  key={report.id}
                  className='m-5 flex flex-col border bg-blue-200 p-5'
                >
                  <span className='text-red-400'>ID: {report.id}</span>
                  <br />
                  {report.name}
                  <div>
                    OverallPercentage: {report.factCheckOverallPercentage} |
                    {report.factCheckOverallPercentage !== undefined &&
                    report.factCheckOverallPercentage !== null
                      ? `${report.factCheckOverallPercentage}%`
                      : 'NO'}
                  </div>
                  {/* <div className='flex flex-col'>
                    <div>Severity: {report.parameters.severity}</div>
                    <div>IncidentType: {report.parameters.incidentType}</div>
                    <div>Location: {report.parameters.locationSummary}</div>
                    <div>FactCheckStatus: {report.factCheckStatus}</div>
                  </div> */}
                  {report.parameters && (
                    <div className='flex flex-col'>
                      <div>Severity: {report.parameters.severity}</div>
                      <div>IncidentType: {report.parameters.incidentType}</div>
                      <div>Location: {report.parameters.locationSummary}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SocketExample
