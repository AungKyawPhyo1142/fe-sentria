import { ReportResponse } from '@/services/network/lib/reports'
import { InfiniteData, useQueryClient } from '@tanstack/react-query'
import { socket } from '../socket'
import { config } from '@config/register'

interface FactCheckUpdate {
  reportId: string
  factCheck: {
    status: string
    factCheckOverallPercentage: number
    lastCalculatedAt: number
    narrative: string
  }
}

class ReportSocketManager {
  private queryClient: ReturnType<typeof useQueryClient>
  private subscriptions: Set<string> = new Set()
  private reportUpdateSocket: string

  constructor(queryClient: ReturnType<typeof useQueryClient>) {
    this.queryClient = queryClient
    this.reportUpdateSocket = config.socket_report_name
    this.setupEventHandlers()
  }

  private setupEventHandlers() {
    socket.on(this.reportUpdateSocket, this.handleFactCheckUpdate)
  }

  private handleFactCheckUpdate = (data: FactCheckUpdate) => {
    console.log('Received WebSocket update:', data)
    this.queryClient.setQueryData<InfiniteData<ReportResponse>>(
      [`get-all-disaster-reports`],
      (oldData) => {
        if (!oldData) return oldData
        console.log('Current data:', oldData)
        const newData = {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: {
              ...page.data,
              reports: {
                ...page.data.reports,
                data: page.data.reports.data.map((report: any) => {
                  if (report.id === data.reportId) {
                    console.log('Updating report:', report.id)
                    console.log('New values:', {
                      factCheckStatus: data.factCheck.status,
                      factCheckOverallPercentage: data.factCheck.factCheckOverallPercentage,
                      factCheckLastUpdatedAt: data.factCheck.lastCalculatedAt
                    })
                    return {
                      ...report,
                      factCheckStatus: data.factCheck.status,
                      factCheckOverallPercentage: data.factCheck.factCheckOverallPercentage,
                      factCheckLastUpdatedAt: data.factCheck.lastCalculatedAt,
                      factCheck: {
                        ...report.factCheck,
                        factCheckOverallPercentage: data.factCheck.factCheckOverallPercentage
                      }
                    }
                  }
                  return report
                }),
              },
            },
          })),
        }
        console.log('Updated data:', newData)
        return newData
      },
    )
  }

  public connect(reportData?: ReportResponse[]) {
    if (!reportData) return
    socket.connect()
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server: ', socket.id)
      this.subscribeToReports(reportData)
    })
  }

  private subscribeToReports(reportData: ReportResponse[]) {
    reportData.forEach((page) => {
      page.data.reports.data.forEach((report) => {
        if (!this.subscriptions.has(report.id)) {
          socket.emit('subscribe_to_report', report.id, (res: any) => {
            console.log(`Subscribed to report: ${report.id}, `, res)
            this.subscriptions.add(report.id)
          })
        }
      })
    })
  }

  public disconnect() {
    this.subscriptions.forEach((reportId) => {
      socket.emit('unsubscribe_from_report', reportId, (res: any) => {
        console.log(`Unsubscribed from report: ${reportId}, `, res)
      })
    })

    this.subscriptions.clear()
    socket.off(this.reportUpdateSocket)
    socket.disconnect()
  }
}

export const useReportWebSocket = (reportData?: ReportResponse[]) => {
  const queryClient = useQueryClient()
  const reportSocketManager = new ReportSocketManager(queryClient)

  if (reportData) {
    reportSocketManager.connect(reportData)
  }

  // Cleanup
  return () => reportSocketManager.disconnect()
}
