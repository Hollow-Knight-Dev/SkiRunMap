import { create } from 'zustand'

interface MapStore {
  map: google.maps.Map | null
  setMap: (newMap: google.maps.Map | null) => void
  routeCoordinate: { lat: number | undefined; lng: number | undefined }
  setRouteCoordinate: (coordinate: { lat: number; lng: number }) => void
  spotCoordinates: { lat: number; lng: number }[]
  addSpotCoordinates: (coordinate: { lat: number; lng: number }) => void
}

export const useMapStore = create<MapStore>((set) => ({
  map: null,
  setMap: (newMap) => set({ map: newMap }),
  routeCoordinate: { lat: undefined, lng: undefined },
  setRouteCoordinate: (coordinate) => set({ routeCoordinate: coordinate }),
  spotCoordinates: [],
  addSpotCoordinates: (coordinate) =>
    set((state) => ({ spotCoordinates: [...state.spotCoordinates, coordinate] }))
}))
