import { Navigate } from 'react-router-dom'
import SignIn from '../../pages/Signin'
import { useUserStore } from '../../store/useUser'

const ProtectedSignInRoute = () => {
  const { isSignIn, userID, isLoadedUserDoc, userDoc } = useUserStore()
  // console.log('ProtectedSignInRoute isLoadedUserDoc:', isLoadedUserDoc)
  // console.log('ProtectedSignInRoute isSignIn:', isSignIn)
  // console.log('ProtectedSignInRoute userDoc:', userDoc)
  // console.log('ProtectedSignInRoute userDoc.userFinishedInfo:', userDoc?.userFinishedInfo)

  if (isLoadedUserDoc && isSignIn && userDoc?.userFinishedInfo) {
    return <Navigate to={`/member/${userID}`} />
  } else if (isLoadedUserDoc && isSignIn && !userDoc?.userFinishedInfo) {
    return <Navigate to='/member-info' />
  } else {
    return <SignIn />
  }
}

export default ProtectedSignInRoute
