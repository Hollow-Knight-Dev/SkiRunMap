import { Navigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MemberInfo from '../../pages/MemberInfo'
import { useUserStore } from '../../store/useUser'

const ProtectedMemberInfoRoute = () => {
  const { isLoadedUserDoc, isSignIn } = useUserStore()
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
  }
  return <MemberInfo />
}

export default ProtectedMemberInfoRoute
