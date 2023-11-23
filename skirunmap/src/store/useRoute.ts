import { create } from 'zustand'

interface RouteTitle {
  routeTitle: string
  setRouteTitle: (newTitle: string) => void
}

export const useRouteTitle = create<RouteTitle>()((set) => ({
  routeTitle: '',
  setRouteTitle: (newTitle) => set(() => ({ routeTitle: newTitle }))
}))

interface SpotTitle {
  spotTitle: string
  setSpotTitle: (newTitle: string) => void
}

export const useSpotTitle = create<SpotTitle>()((set) => ({
  spotTitle: '',
  setSpotTitle: (newTitle) => set(() => ({ spotTitle: newTitle }))
}))

interface RouteDescription {
  routeDescription: string
  setRouteDescription: (newDescription: string) => void
}

export const useRouteDescription = create<RouteDescription>()((set) => ({
  routeDescription: '',
  setRouteDescription: (newDescription) => set(() => ({ routeDescription: newDescription }))
}))
