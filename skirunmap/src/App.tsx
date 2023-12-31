import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useEffect } from 'react'
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from 'react-router-dom'
import './App.css'
import RootLayout from './RootLayout'
import { db } from './auth/Firebase'
import Friend from './pages/Friend'
import Home from './pages/Home'
import ImageCredit from './pages/ImageCredit'
import Member from './pages/Member'
import NoMatch from './pages/NoMatch'
import RouteEdit from './pages/RouteEdit'
import RouteView from './pages/RouteView'
import SearchResult from './pages/SearchResult'
import { User, useUserStore } from './store/useUser'
import ProtectedMemberInfoRoute from './utils/ProtectedMemberInfoRoute'
import ProtectedRoute from './utils/ProtectedRoute'
import ProtectedSignInRoute from './utils/ProtectedSignInRoute'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path='route/:id' element={<RouteView />} />
      <Route path='search/:keyword' element={<SearchResult />} />
      <Route path='signin' element={<ProtectedSignInRoute />} />
      <Route path='credit' element={<ImageCredit />} />
      <Route element={<ProtectedRoute />}>
        <Route path='edit-route' element={<RouteEdit />} />
        <Route path='member/:memberID' element={<Member />} />
        <Route path='friend' element={<Friend />} />
      </Route>
      <Route path='member-info' element={<ProtectedMemberInfoRoute />} />
      <Route path='*' element={<NoMatch />} />
    </Route>
  )
)

const App: React.FC = () => {
  const {
    isSignIn,
    setIsSignIn,
    setUserID,
    setUserDoc,
    isLoadedUserDoc,
    setIsLoadedUserDoc,
    setIsLoadedPage
  } = useUserStore()

  const auth = getAuth()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsSignIn(!!user)

      if (user) {
        setUserID(user.uid)

        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          const userDocData = userDoc.data() as User
          setUserDoc(userDocData)
          setIsLoadedUserDoc(true)
          setIsLoadedPage(true)
        } catch (error) {
          console.error('Error fetching user document with onAuthStateChanged:', error)
        }
      } else {
        setUserID('')
        setIsLoadedUserDoc(false)
        setUserDoc({} as User)
        setIsLoadedPage(true)
      }
    })

    return () => unsubscribe()
  }, [isSignIn, isLoadedUserDoc])

  return <RouterProvider router={router} />
}

export default App
