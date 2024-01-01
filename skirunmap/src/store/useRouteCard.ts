import { create } from 'zustand'

export interface RouteCardImgControl {
  [routeID: string]: number
}

export interface RouteCardLike {
  [routeID: string]: boolean
}

export interface RouteCardDisike {
  [routeID: string]: boolean
}

interface RouteCardStore {
  selectedImages: RouteCardImgControl
  setSelectedImages: (newState: RouteCardImgControl) => void
  likeRouteCards: RouteCardLike
  setLikeRouteCards: (newState: RouteCardLike) => void
  dislikeRouteCards: RouteCardDisike
  setDislikeRouteCards: (newState: RouteCardDisike) => void
}

export const useRouteCardStore = create<RouteCardStore>()((set) => ({
  selectedImages: {},
  setSelectedImages: (newState: RouteCardImgControl) => set({ selectedImages: newState }),
  likeRouteCards: {},
  setLikeRouteCards: (newState: RouteCardLike) => set({ likeRouteCards: newState }),
  dislikeRouteCards: {},
  setDislikeRouteCards: (newState: RouteCardDisike) => set({ dislikeRouteCards: newState })
}))
