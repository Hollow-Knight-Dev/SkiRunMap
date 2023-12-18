import { create } from 'zustand'

export interface RouteCardImgControl {
  [routeID: string]: number
}

interface RouteCardStore {
  selectedImages: RouteCardImgControl
  setSelectedImages: (newState: RouteCardImgControl) => void
}

export const useRouteCardStore = create<RouteCardStore>()((set) => ({
  selectedImages: {},
  setSelectedImages: (newState: RouteCardImgControl) => set({ selectedImages: newState })
}))
