import { create } from 'zustand'

export interface MarkerWithSpotId extends google.maps.Marker {
  spotID: string
}

interface MapStore {
  map: google.maps.Map | null
  setMap: (newMap: google.maps.Map | null) => void
  markers: MarkerWithSpotId[]
  setMarkers: (newMarkers: MarkerWithSpotId[] | []) => void
  addMarker: (marker: MarkerWithSpotId) => void
  updateMarker: (spotID: string, newMarker: MarkerWithSpotId) => void
  removeMarker: (spotID: string) => void
  infoWindow: google.maps.InfoWindow | null
  setInfoWindow: (newInfoWindow: google.maps.InfoWindow | null) => void
}

export const useMapStore = create<MapStore>((set) => ({
  map: null,
  setMap: (newMap) => set({ map: newMap }),
  markers: [],
  setMarkers: (newMarkers) => set({ markers: newMarkers }),
  addMarker: (newMarker) => set((state) => ({ markers: [...state.markers, newMarker] })),
  updateMarker: (spotID, newMarker) =>
    set((state) => {
      const markerIndex = state.markers.findIndex((marker) => marker.spotID === spotID)
      if (markerIndex !== -1) {
        const updatedMarkers = [...state.markers]
        updatedMarkers[markerIndex] = newMarker
        return { markers: updatedMarkers }
      }
      return state
    }),
  removeMarker: (spotID) =>
    set((state) => {
      const markerIndex = state.markers.findIndex((marker) => marker.spotID === spotID)
      if (markerIndex !== -1) {
        const updatedMarkers = [
          ...state.markers.slice(0, markerIndex),
          ...state.markers.slice(markerIndex + 1)
        ]
        return { markers: updatedMarkers }
      }
      return state
    }),
  infoWindow: null,
  setInfoWindow: (newInfoWindow) =>
    set((state) => {
      if (state.infoWindow) {
        state.infoWindow.close()
      }
      return { infoWindow: newInfoWindow }
    })
}))
