import { Navigate, Outlet } from 'react-router-dom'
import { useUserStore } from '../../store/useUser'
import showToast from '../showToast'

const ProtectedRoute: React.FC = () => {
  const { userDoc, isLoadedPage, isSignIn, isLoadedUserDoc } = useUserStore()

  if (isLoadedPage && !isSignIn && isLoadedUserDoc) {
    showToast('warn', 'Please sign in first.')
    return <Navigate to='/signin' />
  } else if (isLoadedPage && isSignIn && userDoc.userFinishedInfo === false) {
    showToast('warn', "You haven't finish your profile.")
    return <Navigate to='/member-info' />
  }
  return <Outlet />
}

export default ProtectedRoute
