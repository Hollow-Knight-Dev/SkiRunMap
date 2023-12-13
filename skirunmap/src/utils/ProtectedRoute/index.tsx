import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useUserStore } from '../../store/useUser'

interface RouteProps {
  children: ReactNode
}

const ProtectedRoute: React.FC<RouteProps> = ({ children }) => {
  const { userDoc, isLoadedUserDoc, isSignIn } = useUserStore()

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
  return <div>{children}</div>
}

export default ProtectedRoute
