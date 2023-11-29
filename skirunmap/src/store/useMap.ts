import { create } from 'zustand'

interface MapStore {
  map: google.maps.Map | null
  setMap: (newMap: google.maps.Map | null) => void
}

export const useMapStore = create<MapStore>((set) => ({
  map: null,
  setMap: (newMap) => set({ map: newMap })
}))
