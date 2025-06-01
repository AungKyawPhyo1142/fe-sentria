import { config } from '@config/register'
import { io } from 'socket.io-client'

export const socket = io(config.endpoint, {
  autoConnect: false,
  transports: ['websocket'],
})
