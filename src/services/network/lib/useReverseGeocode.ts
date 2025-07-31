// import { useState } from 'react'
// import { STATUS } from './auth'
// import { apiClient } from '../apiClient'
// import { ApiConstantRoutes } from '../path'

// export interface ReverseGeocodeRequest {
//   lat: number
//   lng: number
// }



// // export const useReverseGeocode = () => {
// //   const [loading, setLoading] = useState(false)
// //   const [error, setError] = useState<string | null>(null)

// //   async function fetchLocation({
// //     lat,
// //     lng,
// //   }: ReverseGeocodeRequest): Promise<PlaceInfo | null> {
// //     setLoading(true)
// //     setError(null)
// //     try {
// //       const response = await apiClient.post<ReverseGeocodeResponse>(
// //         ApiConstantRoutes.paths.location.reverseGeocode,
// //         { lat, lng },
// //       )
// //       console.log('Raw reverse geocode API response:', response)

// //       const { data } = response
// //       if (data.status === 'SUCCESS') {
// //         return {
// //           latitude: data.data.lat,
// //           longitude: data.data.lng,
// //           city: data.data.city,
// //           country: data.data.country,
// //         }
// //       } else {
// //         setError('Reverse geocode failed')
// //         return null
// //       }
// //     } catch (err) {
// //       setError('Error calling reverse geocode API')
// //       return null
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   return {
// //     fetchLocation,
// //     loading,
// //     error,
// //   }
// // }

// export function useReverseGeocode() {
//   const [loading, setLoading] = useState(false)
//   const [data, setData] = useState<ReverseGeocodeResponse['data'] | null>(null)
//   const [error, setError] = useState<string | null>(null)

//   const fetchLocation = async (body: ReverseGeocodeRequest) => {
//     setLoading(true)
//     setError(null)
//     console.log('📤 Sending request to reverse geocode:', body)

//     try {
//       const response = await apiClient.post<ReverseGeocodeResponse>(
//         ApiConstantRoutes.paths.location.reverseGeocode,
//         body,
//       )
//       console.log('✅ Received response:', response.data)
//       if (response.data.status === 'SUCCESS') {
//         setData(response.data.data)
//       } else {
//         // this step
//         console.warn('⚠️ Reverse geocode failed:', response.data) 
//         setError('Failed to fetch location')
//       }
//     } catch (err: any) {
//       console.error('❌ Error in reverse geocode:', err)
//       setError(err?.message || 'An unexpected error occurred')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return {
//     fetchLocation,
//     data,
//     loading,
//     error,
//   }
// }
