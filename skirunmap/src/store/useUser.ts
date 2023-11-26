import { create } from 'zustand'

interface UserID {
  userID: string
  setUserID: (userID: string) => void
}

export const useUserID = create<UserID>()((set) => ({
  userID: '',
  setUserID: (newUserID) => set(() => ({ userID: newUserID }))
}))

interface IsSignIn {
  isSignIn: boolean
  setIsSignIn: (signState: boolean) => void
}

export const useIsSignIn = create<IsSignIn>()((set) => ({
  isSignIn: false,
  setIsSignIn: (signState) => set(() => ({ isSignIn: signState }))
}))
