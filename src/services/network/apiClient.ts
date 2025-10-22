import { config } from '../../../config/register'
import axios from 'axios'

const apiClient = axios.create({
  baseURL: config.endpoint,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

apiClient.interceptors.response.use(
  function (response) {
    console.log('API called successfully:', response)
    return response.data
  },
  function (error) {
    const res = error.response
    console.log('API call failed:', res.status)
    return Promise.reject(res)
  },
)

export { apiClient }
