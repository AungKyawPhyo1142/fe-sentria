/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState } from 'react'

type MapFilterContextType = {
  selectedTypes: Set<string>
  toggleType: (type: string) => void
  needed: boolean
  setNeeded: (val: boolean) => void
  available: boolean
  setAvailable: (val: boolean) => void
}

const MapFilterContext = createContext<MapFilterContextType | null>(null)

export const MapFilterProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(
    new Set(['shelter', 'water', 'food', 'wifi']),
  )
  const [needed, setNeeded] = useState(true)
  const [available, setAvailable] = useState(true)

  const toggleType = (type: string) => {
    setSelectedTypes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(type)) {
        newSet.delete(type)
      } else {
        newSet.add(type)
      }
      return newSet
    })
  }

  return (
    <MapFilterContext.Provider
      value={{
        selectedTypes,
        toggleType,
        needed,
        setNeeded,
        available,
        setAvailable,
      }}
    >
      {children}
    </MapFilterContext.Provider>
  )
}

export const useMapFilter = () => {
  const context = useContext(MapFilterContext)
  if (!context)
    throw new Error('useMapFilter must be used within MapFilterProvider')
  return context
}
