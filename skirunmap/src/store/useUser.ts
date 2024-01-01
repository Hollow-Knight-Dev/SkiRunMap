import { FieldValue } from 'firebase/firestore'
import { create } from 'zustand'

export interface StoreRouteLists {
  listName: string
  routeIDs: string[]
}

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
  userDraftRouteIDs: string[]
  userFinishedInfo: boolean
  userRouteLists: StoreRouteLists[]
}

interface UserStore {
  isSignIn: boolean
  setIsSignIn: (signState: boolean) => void
  userDoc: User
  setUserDoc: (doc: User) => void
  isLoadedUserDoc: boolean
  setIsLoadedUserDoc: (status: boolean) => void
  isLoadedPage: boolean
  setIsLoadedPage: (status: boolean) => void
  userID: string
  setUserID: (userID: string) => void
  userEmail: string
  setUserEmail: (email: string) => void
  userPassword: string
  setUserPassword: (email: string) => void
  username: string
  setUsername: (name: string) => void
  userIconUrl: string
  setUserIconUrl: (url: string) => void
  userSkiAge: string
  setUserSkiAge: (age: string) => void
  userSnowboardAge: string
  setUserSnowboardAge: (age: string) => void
  userCountry: string
  setUserCountry: (country: string) => void
  userGender: string
  setUserGender: (gender: string) => void
  userDescription: string
  setUserDescription: (description: string) => void
}

export const useUserStore = create<UserStore>()((set) => ({
  isSignIn: false,
  setIsSignIn: (signState) => set(() => ({ isSignIn: signState })),
  userDoc: {} as User,
  setUserDoc: (doc) => set({ userDoc: doc }),
  isLoadedUserDoc: false,
  setIsLoadedUserDoc: (status) => set({ isLoadedUserDoc: status }),
  isLoadedPage: false,
  setIsLoadedPage: (state) => set({ isLoadedPage: state }),
  userID: '',
  setUserID: (newUserID) => set(() => ({ userID: newUserID })),
  userEmail: '',
  setUserEmail: (email) => set(() => ({ userEmail: email })),
  userPassword: '',
  setUserPassword: (password) => set(() => ({ userPassword: password })),
  username: '',
  setUsername: (name) => set(() => ({ username: name })),
  userIconUrl:
    'https://firebasestorage.googleapis.com/v0/b/skirunmap.appspot.com/o/default-user-icon.png?alt=media&token=d4a1a132-603a-4e91-9adf-2623dda20777',
  setUserIconUrl: (newUrl) => set(() => ({ userIconUrl: newUrl })),
  userSkiAge: '',
  setUserSkiAge: (age) => set(() => ({ userSkiAge: age })),
  userSnowboardAge: '',
  setUserSnowboardAge: (age) => set(() => ({ userSnowboardAge: age })),
  userCountry: '',
  setUserCountry: (country) => set(() => ({ userCountry: country })),
  userGender: '',
  setUserGender: (gender) => set(() => ({ userGender: gender })),
  userDescription: '',
  setUserDescription: (description) => set(() => ({ userDescription: description }))
}))
