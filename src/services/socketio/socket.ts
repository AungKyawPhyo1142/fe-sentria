import { io } from "socket.io-client"

// TODO: we will use env variables for this later
const SERVER_URL = 'localhost:3000'

export const socket = io(SERVER_URL, {
  autoConnect: false,
  transports: ['websocket'],
})