import { create } from "zustand"


// global state for user current location
// we can reuse this state to get the user's current location anytime
export interface UserCurrentLocationState {
    lat: number | null
    lng: number | null
}

type UserCurrentLocationStore = {
    location: UserCurrentLocationState
    setUserCurrentLocation: (location: UserCurrentLocationState) => void
    clearUserCurrentLocation: () => void
}

export const useUserCurrentLocationStore = create<UserCurrentLocationStore>((set) => ({
    location: {
        lat: null,
        lng: null,
    },
    setUserCurrentLocation: (location) => set({ location }),
    clearUserCurrentLocation: () => set({ location: { lat: null, lng: null } }),

}))

export const selectUserCurrentLocation = (state: UserCurrentLocationStore) => state.location
export const setUserCurrentLocation = (location: UserCurrentLocationState) => useUserCurrentLocationStore.getState().setUserCurrentLocation(location)
export const clearUserCurrentLocation = () => useUserCurrentLocationStore.getState().clearUserCurrentLocation()