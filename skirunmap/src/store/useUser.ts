import { FieldValue } from 'firebase/firestore'
import { create } from 'zustand'

export interface User {
  userID: string
  userEmail: string
  userJoinedTime: FieldValue
  username: string
  userIconUrl: string
  userSkiAge: string
  userSnowboardAge: string
  userCountry: string
  userGender: string
  userDescription: string
  userFollows: string[]
  userFollowers: string[]
  userFriends: string[]
  userFriendReqs: string[]
  userSentFriendReqs: string[]
  userRouteIDs: string[]
}

interface UserStore {
  isSignIn: boolean
  setIsSignIn: (signState: boolean) => void
  userID: string
  setUserID: (userID: string) => void
  userEmail: string
  setUserEmail: (email: string) => void
  userPassword: string
  setUserPassword: (email: string) => void
  userIconUrl: string
  setUserIconUrl: (userID: string) => void
}

export const useUserStore = create<UserStore>()((set) => ({
  isSignIn: false,
  setIsSignIn: (signState) => set(() => ({ isSignIn: signState })),
  userID: '',
  setUserID: (newUserID) => set(() => ({ userID: newUserID })),
  userEmail: '',
  setUserEmail: (newEmail) => set(() => ({ userEmail: newEmail })),
  userPassword: '',
  setUserPassword: (newEmail) => set(() => ({ userEmail: newEmail })),
  userIconUrl:
    'https://firebasestorage.googleapis.com/v0/b/skirunmap.appspot.com/o/default-user-icon.png?alt=media&token=d4a1a132-603a-4e91-9adf-2623dda20777',
  setUserIconUrl: (newUrl) => set(() => ({ userIconUrl: newUrl }))
}))
