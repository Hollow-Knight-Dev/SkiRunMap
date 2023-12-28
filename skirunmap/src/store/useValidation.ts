import { create } from 'zustand'

interface useValidation {
  hasRouteTitleError: boolean
  setHasRouteTitleError: (state: boolean) => void
  hasSpotTitleError: boolean[]
  setHasSpotTitleError: (state: boolean[]) => void
}

export const useValidationStore = create<useValidation>()((set) => ({
  hasRouteTitleError: false,
  setHasRouteTitleError: (state) => set({ hasRouteTitleError: state }),
  hasSpotTitleError: [],
  setHasSpotTitleError: (state) => set({ hasSpotTitleError: state })
}))
