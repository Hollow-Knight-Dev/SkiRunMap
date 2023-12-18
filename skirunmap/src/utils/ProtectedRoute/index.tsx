import { useEffect } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useUserStore } from '../../store/useUser'

const ProtectedRoute: React.FC = () => {
  const { userDoc, isLoadedPage, isSignIn } = useUserStore()
  const navigate = useNavigate()

  useEffect(() => {
    console.log('ProtectedRoute isLoadedPage:', isLoadedPage)
    console.log('ProtectedRoute isSignIn:', isSignIn)
  }, [navigate])

  if (isLoadedPage && !isSignIn) {
    toast.warn(`Please sign in first`, {
      position: 'top-right',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: 'light'
    })
    return <Navigate to='/signin' />
  } else if (isLoadedPage && isSignIn && userDoc.userFinishedInfo === false) {
    toast.warn(`You haven't finish your profile`, {
      position: 'top-right',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: 'light'
    })
    return <Navigate to='/member-info' />
  }
  return <Outlet /> // Outlet is used to render the child routes
}

export default ProtectedRoute
