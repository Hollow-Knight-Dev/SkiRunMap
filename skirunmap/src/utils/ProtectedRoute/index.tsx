import { Navigate, Outlet } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useUserStore } from '../../store/useUser'

const ProtectedRoute: React.FC = () => {
  const { userDoc, isLoadedUserDoc, isSignIn } = useUserStore()

  // console.log('ProtectedRoute isLoadedUserDoc:', isLoadedUserDoc)
  // console.log('ProtectedRoute isSignIn:', isSignIn)

  if (isLoadedUserDoc && !isSignIn) {
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
  } else if (isLoadedUserDoc && isSignIn && userDoc.userFinishedInfo === false) {
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
  return <Outlet />
}

export default ProtectedRoute
