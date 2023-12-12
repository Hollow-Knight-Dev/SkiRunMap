import { FieldValue } from 'firebase/firestore'
import { create } from 'zustand'

export interface Coordinate {
  lat: number | undefined
  lng: number | undefined
}

export interface Spot {
  spotID: string
  spotTitle: string
  spotDescription: string
  spotCoordinate: { lat: number; lng: number }
  imageUrls: string[]
  videoUrls: string[]
}

export interface Comment {
  userID: string
  username: string
  userIconUrl: string
  comment: string
  commentTimestamp: FieldValue
}

export interface Route {
  userID: string
  username: string
  routeID: string
  routeTitle: string
  gpxUrl: string
  routeCoordinate: Coordinate
  tags: string[]
  snowBuddies: string[]
  isPublic: boolean
  spots: Spot[]
  isSubmitted: boolean
  createTime: FieldValue
  likeUsers: string[]
  dislikeUsers: string[]
  likeCount: number
  viewCount: number
}

interface RouteStore {
  routeID: string
  setRouteID: (routeID: string) => void
  routeTitle: string
  setRouteTitle: (newTitle: string) => void
  routeCoordinate: Coordinate
  setRouteCoordinate: (coordinate: Coordinate) => void
  routeDescription: string
  setRouteDescription: (newDescription: string) => void
  tags: string[]
  setTags: (newTags: string[]) => void
  tagInput: string
  setTagInput: (newTagInput: string) => void
  buddies: string[]
  setBuddies: (newBuddies: string[]) => void
  buddyInput: string
  setBuddyInput: (newBuddyInput: string) => void
  accessRight: boolean
  setAccessRight: (newRight: boolean) => void
  gpxUrl: string
  setGpxUrl: (url: string) => void
}

export const useRouteStore = create<RouteStore>()((set) => ({
  routeID: '',
  setRouteID: (newRouteID) => set(() => ({ routeID: newRouteID })),
  routeTitle: '',
  setRouteTitle: (newTitle) => set(() => ({ routeTitle: newTitle })),
  routeCoordinate: { lat: undefined, lng: undefined },
  setRouteCoordinate: (coordinate) => set({ routeCoordinate: coordinate }),
  routeDescription: '',
  setRouteDescription: (newDescription) => set(() => ({ routeDescription: newDescription })),
  tags: [],
  setTags: (newTags) => set(() => ({ tags: newTags })),
  tagInput: '',
  setTagInput: (newTagInput) => set(() => ({ tagInput: newTagInput })),
  buddies: [],
  setBuddies: (newBuddies) => set(() => ({ buddies: newBuddies })),
  buddyInput: '',
  setBuddyInput: (newBuddyInput) => set(() => ({ buddyInput: newBuddyInput })),
  accessRight: true,
  setAccessRight: (newRight) => set(() => ({ accessRight: newRight })),
  gpxUrl: '',
  setGpxUrl: (url) => set(() => ({ gpxUrl: url }))
}))

// interface RouteID {
//   routeID: string
//   setRouteID: (routeID: string) => void
// }

// export const useRouteID = create<RouteID>()((set) => ({
//   routeID: '',
//   setRouteID: (newRouteID) => set(() => ({ routeID: newRouteID }))
// }))

// interface RouteTitle {
//   routeTitle: string
//   setRouteTitle: (newTitle: string) => void
// }

// export const useRouteTitle = create<RouteTitle>()((set) => ({
//   routeTitle: '',
//   setRouteTitle: (newTitle) => set(() => ({ routeTitle: newTitle }))
// }))

// interface RouteDescription {
//   routeDescription: string
//   setRouteDescription: (newDescription: string) => void
// }

// export const useRouteDescription = create<RouteDescription>()((set) => ({
//   routeDescription: '',
//   setRouteDescription: (newDescription) => set(() => ({ routeDescription: newDescription }))
// }))

// interface Tags {
//   tags: string[]
//   setTags: (newTags: string[]) => void
// }

// export const useTags = create<Tags>()((set) => ({
//   tags: [],
//   setTags: (newTags) => set(() => ({ tags: newTags }))
// }))

// interface TagInput {
//   tagInput: string
//   setTagInput: (newTagInput: string) => void
// }

// export const useTagInput = create<TagInput>()((set) => ({
//   tagInput: '',
//   setTagInput: (newTagInput) => set(() => ({ tagInput: newTagInput }))
// }))

// interface Buddies {
//   buddies: string[]
//   setBuddies: (newBuddies: string[]) => void
// }

// export const useBuddies = create<Buddies>()((set) => ({
//   buddies: [],
//   setBuddies: (newBuddies) => set(() => ({ buddies: newBuddies }))
// }))

// interface BuddyInput {
//   buddyInput: string
//   setBuddyInput: (newBuddyInput: string) => void
// }

// export const useBuddyInput = create<BuddyInput>()((set) => ({
//   buddyInput: '',
//   setBuddyInput: (newBuddyInput) => set(() => ({ buddyInput: newBuddyInput }))
// }))

// interface AccessRight {
//   accessRight: boolean
//   setAccessRight: (newRight: boolean) => void
// }

// export const useAccessRight = create<AccessRight>()((set) => ({
//   accessRight: true,
//   setAccessRight: (newRight) => set(() => ({ accessRight: newRight }))
// }))

// interface GpxUrl {
//   gpxUrl: string
//   setGpxUrl: (url: string) => void
// }

// export const useGpxUrl = create<GpxUrl>()((set) => ({
//   gpxUrl: '',
//   setGpxUrl: (url) => set(() => ({ gpxUrl: url }))
// }))

interface SpotStore {
  spots: Spot[]
  addSpot: (spot: Spot) => void
  updateSpot: (index: number, spot: Spot) => void
  removeSpot: (index: number) => void
  alterSpot: (index: number, alteredSpot: Partial<Spot>) => void
}

export const useSpotStore = create<SpotStore>()((set) => ({
  spots: [],
  addSpot: (spot) => set((state) => ({ spots: [...state.spots, spot] })),
  updateSpot: (index, spot) =>
    set((state) => ({
      spots: [...state.spots.slice(0, index), spot, ...state.spots.slice(index + 1)]
    })),
  removeSpot: (index) =>
    set((state) => ({ spots: [...state.spots.slice(0, index), ...state.spots.slice(index + 1)] })),
  alterSpot: (index, alteredSpot) =>
    set((state) => ({
      spots: state.spots.map((spot, i) => (i === index ? { ...spot, ...alteredSpot } : spot))
    }))
}))

// interface CoordinateStore {
//   routeCoordinate: Coordinate
//   setRouteCoordinate: (coordinate: Coordinate) => void
// }

// export const useCoordinateStore = create<CoordinateStore>((set) => ({
//   routeCoordinate: { lat: undefined, lng: undefined },
//   setRouteCoordinate: (coordinate) => set({ routeCoordinate: coordinate })
// }))
