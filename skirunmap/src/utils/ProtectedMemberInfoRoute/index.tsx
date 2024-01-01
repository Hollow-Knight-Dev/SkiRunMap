import { Navigate } from 'react-router-dom'
import MemberInfo from '../../pages/MemberInfo'
import { useUserStore } from '../../store/useUser'
import showToast from '../showToast'

const ProtectedMemberInfoRoute = () => {
  const { isLoadedPage, isSignIn } = useUserStore()
  if (isLoadedPage && !isSignIn) {
    showToast('warn', 'Please sign in first.')
    return <Navigate to='/signin' />
  }
  return <MemberInfo />
}

export default ProtectedMemberInfoRoute
