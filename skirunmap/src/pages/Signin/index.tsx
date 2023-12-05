import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { db } from '../../auth/CloudStorage'
import { User, useUserStore } from '../../store/useUser'

const SignIn: React.FC = () => {
  const navigate = useNavigate()
  const auth = getAuth()
  const [isSignUp, setIsSignUp] = useState<boolean>(false)
  const { userID, setUserID, userEmail, setUserEmail, userPassword, setUserPassword } =
    useUserStore()

  useEffect(() => {
    if (userID) {
      console.log(userID)
    }
  }, [userID])

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.trim()
    setUserEmail(input)
  }

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.trim()
    setUserPassword(input)
  }

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, userEmail, userPassword)
      .then(async (userCredential) => {
        const userID = userCredential.user.uid
        setUserID(userID)
        // console.log(userID)

        const data: User = {
          userID: userID,
          userEmail: userEmail,
          userJoinedTime: serverTimestamp(),
          username: '',
          userIconUrl:
            'https://firebasestorage.googleapis.com/v0/b/skirunmap.appspot.com/o/default-user-icon.png?alt=media&token=d4a1a132-603a-4e91-9adf-2623dda20777',
          userSkiAge: '',
          userSnowboardAge: '',
          userCountry: '',
          userGender: '',
          userDescription: '',
          userFollows: [],
          userFollowers: [],
          userFriends: [],
          userFriendReqs: [],
          userSentFriendReqs: [],
          userRouteIDs: [],
          userDraftRouteIDs: [],
          userFinishedInfo: false,
          userStoreRoutes: []
        }
        await setDoc(doc(db, 'users', userID), data)

        signInWithEmailAndPassword(auth, userEmail, userPassword)
        // .then((userCredential) => {
        //   // const userID = userCredential.user.uid
        //   // console.log(userID)
        //   // setUserID(userID)
        //   // setIsSignIn(true)
        // })
        // .catch((error) => {
        //   console.log(error.code, ': ', error.message)
        // })

        toast.success('Sign up successed!', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: 'light',
          onClose: () => {
            navigate('/member-info')
          }
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, userEmail, userPassword)
      .then(async (userCredential) => {
        const userID = userCredential.user.uid
        // console.log(userID)
        // setUserID(userID)
        // setIsSignIn(true)

        const userDoc = await getDoc(doc(db, 'users', userID))
        // console.log(userDoc.data()?.userFinishedInfo)

        if (userDoc.data()?.userFinishedInfo) {
          toast.success(`Welcome back, ${userID}`, {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: 'light',
            onClose: () => {
              navigate('/member')
            }
          })
        } else {
          toast.warn(`You haven't finish your profile`, {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: 'light',
            onClose: () => {
              navigate('/member-info')
            }
          })
        }
      })
      .catch((error) => {
        console.log(error.code, ': ', error.message)
      })
  }

  return (
    <div className='h-screen-256px flex w-full flex-col items-center justify-center'>
      <div className='mb-8 flex gap-20'>
        <p
          className={`h-20 w-20 cursor-pointer rounded-full pt-6 text-center text-xl font-bold ${
            isSignUp ? 'bg-blue-100 text-white hover:bg-blue-400' : 'bg-blue-600 text-white'
          }`}
          onClick={() => setIsSignUp(false)}
        >
          Sign In
        </p>
        <p
          className={`h-20 w-20 cursor-pointer rounded-full pt-6 text-center text-xl font-bold ${
            isSignUp ? 'bg-blue-600 text-white' : 'bg-blue-100 text-white hover:bg-blue-400'
          }`}
          onClick={() => setIsSignUp(true)}
        >
          Sign Up
        </p>
      </div>
      <div className='mb-8 flex w-full flex-col items-center gap-4'>
        <div className='flex h-fit w-4/5 items-center justify-center rounded-full bg-blue-600 p-1 pl-4 text-lg text-white'>
          <label className='w-24'>Email</label>
          <input
            className='h-6 w-2/5 rounded-full bg-blue-500 pl-4'
            type='email'
            value={userEmail}
            onChange={(e) => handleEmail(e)}
          />
        </div>
        <div className='flex h-fit w-4/5 items-center justify-center rounded-full bg-blue-600 p-1 pl-4 text-lg text-white'>
          <label className='w-24'>Password</label>
          <input
            className='h-6 w-2/5 rounded-full bg-blue-500 pl-4'
            type='text'
            value={userPassword}
            onChange={(e) => handlePassword(e)}
          />
        </div>
      </div>
      {isSignUp ? (
        <button
          className='h-fit w-fit rounded-full bg-blue-500 p-4 text-white hover:bg-blue-600'
          onClick={() => handleSignUp()}
        >
          Sign up
        </button>
      ) : (
        <button
          className='h-fit w-fit rounded-full bg-blue-500 p-4 text-white hover:bg-blue-600'
          onClick={() => handleSignIn()}
        >
          Sign In
        </button>
      )}
    </div>
  )
}

export default SignIn
