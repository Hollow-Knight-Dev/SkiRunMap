import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { db } from './auth/CloudStorage'
import Footer from './components/Footer'
import Header from './components/Header'
import Friend from './pages/Friend'
import Home from './pages/Home'
import Member from './pages/Member'
import RouteEdit from './pages/RouteEdit'
import RouteView from './pages/RouteView'
import SearchResult from './pages/SearchResult'
import SignIn from './pages/Signin'
import { User, useUserStore } from './store/useUser'
import ProtectedMemberInfoRoute from './utils/ProtectedMemberInfoRoute'
import ProtectedRoute from './utils/ProtectedRoute'

const App: React.FC = () => {
  const { isSignIn, setIsSignIn, setUserID, setUserDoc, setIsLoadedUserDoc } = useUserStore()
  const auth = getAuth()
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsSignIn(true)
        setUserID(user.uid)
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        const userDocData = userDoc.data() as User
        setUserDoc(userDocData)
        setIsLoadedUserDoc(true)
        console.log('App.tsx userDoc has been updated: ', userDocData)
      } else {
        setIsSignIn(false)
        setUserID('')
        setIsLoadedUserDoc(true)
      }
    })

    return () => unsubscribe()
  }, [isSignIn, setUserID])

  return (
    <BrowserRouter>
      <div className='fixed top-0 z-10 w-full'>
        <Header />
      </div>
      <div className='h-16' />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/route/:id' element={<RouteView />} />
        <Route path='/search' element={<SearchResult />} />
        <Route path='/signin' element={<SignIn />} />
        <Route
          path='/edit-route'
          element={
            <ProtectedRoute>
              <RouteEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path='/member/:memberID'
          element={
            <ProtectedRoute>
              <Member />
            </ProtectedRoute>
          }
        />
        <Route
          path='/friend'
          element={
            <ProtectedRoute>
              <Friend />
            </ProtectedRoute>
          }
        />
        <Route path='/member-info' element={<ProtectedMemberInfoRoute />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
