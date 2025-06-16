import { useGetAllDisasterReports } from '@/services/network/lib/reports'
import { useReportWebSocket } from '@/services/socketio/hooks/useReportWebSocket'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

const WebSocketExample = () => {
  const {
    data: reportData,
    isLoading,
    isError,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetAllDisasterReports()

  const queryClient = useQueryClient()
  const reportSocketCleanup = useReportWebSocket(reportData?.pages)

  // * Cleanup
  useEffect(() => reportSocketCleanup, [])

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
    <>
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
                  OverallPercentage: {report.factCheckOverallPercentage} |{' '}
                  {report.factCheckOverallPercentage !== undefined && report.factCheckOverallPercentage !== null ? `${report.factCheckOverallPercentage}%` : 'NO'}
                </div>
                <div className='flex flex-col'>
                  <div>Severity: {report.parameters.severity}</div>
                  <div>IncidentType: {report.parameters.incidentType}</div>
                  <div>Location: {report.parameters.locationSummary}</div>
                  <div>FactCheckStatus: {report.factCheckStatus}</div>
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
