import { create } from 'zustand'

interface MapStore {
  map: google.maps.Map | null
  setMap: (newMap: google.maps.Map | null) => void
  routeCoordinate: { lat: number | undefined; lng: number | undefined }
  setRouteCoordinate: (coordinate: { lat: number; lng: number }) => void
  spotCoordinates: { lat: number; lng: number }[]
  addSpotCoordinates: (index: number, coordinate: { lat: number; lng: number }) => void
}

export const useMapStore = create<MapStore>((set) => ({
  map: null,
  setMap: (newMap) => set({ map: newMap }),
  routeCoordinate: { lat: undefined, lng: undefined },
  setRouteCoordinate: (coordinate) => set({ routeCoordinate: coordinate }),
  spotCoordinates: [],
  addSpotCoordinates: (index, coordinate) => {
    set((state) => {
      const updatedSpotCoordinates = [...state.spotCoordinates]
      updatedSpotCoordinates[index] = coordinate
      return { spotCoordinates: updatedSpotCoordinates }
    })
  }
}))
