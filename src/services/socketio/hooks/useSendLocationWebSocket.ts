import { useEffect } from 'react'
import { config } from '@config/register'
import { socket } from '../socket'

export interface UserLocation {
  lat: number
  lng: number
}

class UserLocationSocketManager {
  private userLocationSocket: string

  constructor() {
    this.userLocationSocket = config.socket_user_location
  }

  public connect(userLocation: UserLocation) {
    socket.connect()
    socket.on('connect', () => {
      socket.emit(this.userLocationSocket, {
        lat: userLocation.lat,
        lng: userLocation.lng,
      })
      console.log(
        `Connected to ${this.userLocationSocket} with location:`,
        userLocation,
      )
    })
  }

  public disconnect() {
    socket.off(this.userLocationSocket)
    socket.disconnect()
  }
}

export const useSendLocationWebSocket = (userLocation: UserLocation | null) => {
  useEffect(() => {
    if (!userLocation) return

    const userSocketManager = new UserLocationSocketManager()
    userSocketManager.connect(userLocation)

    return () => {
      userSocketManager.disconnect()
    }
  }, [userLocation])
}
