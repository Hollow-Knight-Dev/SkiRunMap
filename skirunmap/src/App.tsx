import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { db } from './auth/CloudStorage'
import Footer from './components/Footer'
import Header from './components/Header'
import Friend from './pages/Friend'
import Home from './pages/Home'
import Member from './pages/Member'
import MemberInfo from './pages/MemberInfo'
import RouteEdit from './pages/RouteEdit'
import RouteView from './pages/RouteView'
import SignIn from './pages/Signin'
import { User, useUserStore } from './store/useUser'

const App: React.FC = () => {
  const { isSignIn, setIsSignIn, setUserID, setUserDoc } = useUserStore()
  const auth = getAuth()
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsSignIn(true)
        setUserID(user.uid)
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        const userDocData = userDoc.data() as User
        setUserDoc(userDocData)
        console.log('App.tsx user state management: ', userDocData)
      } else {
        setIsSignIn(false)
        setUserID('')
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
        <Route path='/signin' element={<SignIn />} />
        <Route path='/member' element={isSignIn ? <Member /> : <Navigate to='/signin' />} />
        <Route
          path='/member-info'
          element={isSignIn ? <MemberInfo /> : <Navigate to='/signin' />}
        />
        <Route path='/edit-route' element={isSignIn ? <RouteEdit /> : <Navigate to='/signin' />} />
        <Route path='/friend' element={isSignIn ? <Friend /> : <Navigate to='/signin' />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
