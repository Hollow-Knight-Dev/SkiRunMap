import { create } from 'zustand'

interface RouteID {
  routeID: string
  setRouteID: (routeID: string) => void
}

export const useRouteID = create<RouteID>()((set) => ({
  routeID: '',
  setRouteID: (newRouteID) => set(() => ({ routeID: newRouteID }))
}))

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

interface SpotDescription {
  spotDescription: string
  setSpotDescription: (newDescription: string) => void
}

export const useSpotDescription = create<SpotDescription>()((set) => ({
  spotDescription: '',
  setSpotDescription: (newDescription) => set(() => ({ spotDescription: newDescription }))
}))

interface Tag {
  tag: string[]
  setTag: (newTag: string[]) => void
}

export const useTag = create<Tag>()((set) => ({
  tag: [],
  setTag: (newTag) => set(() => ({ tag: newTag }))
}))

interface TagInput {
  tagInput: string
  setTagInput: (newTagInput: string) => void
}

export const useTagInput = create<TagInput>()((set) => ({
  tagInput: '',
  setTagInput: (newTagInput) => set(() => ({ tagInput: newTagInput }))
}))

interface Buddy {
  buddy: string[]
  setBuddy: (newBuddy: string[]) => void
}

export const useBuddy = create<Buddy>()((set) => ({
  buddy: [],
  setBuddy: (newBuddy) => set(() => ({ buddy: newBuddy }))
}))

interface BuddyInput {
  buddyInput: string
  setBuddyInput: (newBuddyInput: string) => void
}

export const useBuddyInput = create<BuddyInput>()((set) => ({
  buddyInput: '',
  setBuddyInput: (newBuddyInput) => set(() => ({ buddyInput: newBuddyInput }))
}))

interface AccessRight {
  accessRight: boolean
  setAccessRight: (newRight: boolean) => void
}

export const useAccessRight = create<AccessRight>()((set) => ({
  accessRight: true,
  setAccessRight: (newRight) => set(() => ({ accessRight: newRight }))
}))

interface GpxUrl {
  gpxUrl: string
  setGpxUrl: (url: string) => void
}

export const useGpxUrl = create<GpxUrl>()((set) => ({
  gpxUrl: '',
  setGpxUrl: (url) => set(() => ({ gpxUrl: url }))
}))

interface ImageUrls {
  imageUrls: string[]
  setImageUrls: (url: string[]) => void
}

export const useImageUrls = create<ImageUrls>()((set) => ({
  imageUrls: [],
  setImageUrls: (newUrls) => set(() => ({ imageUrls: newUrls }))
}))

interface VideoUrls {
  videoUrls: string[]
  setVideoUrls: (url: string[]) => void
}

export const useVideoUrls = create<VideoUrls>()((set) => ({
  videoUrls: [],
  setVideoUrls: (url) => set(() => ({ videoUrls: url }))
}))
