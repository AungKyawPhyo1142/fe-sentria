import { config } from "@config/register"
import { socket } from "../socket"

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
        if (!userLocation) return
        socket.connect()
        socket.on('connect', () => {
            socket.emit(this.userLocationSocket, { lat: userLocation.lat, lng: userLocation.lng })
            console.log(`Connected to ${this.userLocationSocket} with location:`, userLocation)
        })
    }

    public disconnect() {
        socket.off(this.userLocationSocket)
        socket.disconnect()
    }

}

export const useSendLocationWebSocket = (userLocation: UserLocation) => {
    const userSocketManager = new UserLocationSocketManager()

    if (userLocation) {
        userSocketManager.connect(userLocation)
    }

    return () => userSocketManager.disconnect

}