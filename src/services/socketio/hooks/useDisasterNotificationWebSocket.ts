import { config } from '@config/register'
import { useEffect } from 'react'
import { socket } from '../socket'

class NotificationManager {
  private EQAlertSocket: string

  constructor() {
    this.EQAlertSocket = config.socket_earthquake_alert
  }

  public connect() {
    socket.connect()
    socket.on('connect', () => {
      console.log(`Connected to ${this.EQAlertSocket}`)
    })
    console.log('WebSocket connected for earthquake alerts')
  }
  public disconnect() {
    socket.off(this.EQAlertSocket)
    socket.disconnect()
    console.log('WebSocket disconnected for earthquake alerts')
  }
}

export const useDisasterNotificationWebSocket = () => {
  useEffect(() => {
    const notificationManager = new NotificationManager()
    notificationManager.connect()

    return () => {
      notificationManager.disconnect()
    }
  }, [])
}
