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
      // console.log('sign in userID:', userID)
    }
  }, [userID])

  // useEffect(() => {}, [navigate])

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.trim()
    setUserEmail(input)
  }

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.trim()
    setUserPassword(input)
  }

  const handleEmailValidation = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (regex.test(email)) {
      return true
    } else {
      toast.warn(`Email format error`, {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'light'
      })
      return false
    }
  }

  const handleSignUp = () => {
    if (handleEmailValidation(userEmail)) {
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
            userRouteLists: []
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
          console.log('Firebase authentication sign up error')
          console.error(error)

          if (error.code === 'auth/email-already-in-use') {
            toast.warn(`Email has been signed up`, {
              position: 'top-right',
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
              theme: 'light'
            })
          } else if (error.code === 'auth/weak-password') {
            toast.warn(`Please use stronger password (at least 6 characters)`, {
              position: 'top-right',
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: false,
              draggable: false,
              progress: undefined,
              theme: 'light'
            })
          }
        })
    }
  }

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, userEmail, userPassword)
      const userID = userCredential.user.uid
      console.log('signin page:', userID)

      const userDoc = await getDoc(doc(db, 'users', userID))
      // // console.log(userDoc.data()?.userFinishedInfo)

      if (userDoc.data()?.userFinishedInfo) {
        toast.success(`Welcome back, ${userDoc.data()?.username}`, {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: 'light'
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
          theme: 'light'
        })
      }
    } catch (error) {
      console.error(error)
      toast.warn(`Incorrect email or password`, {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'light'
      })
    }
  }

  return (
    <div className='h-screen-64px bg-groomed-piste flex w-full flex-col items-center justify-center'>
      <div className='mb-12 flex'>
        <div
          className={`relative transform cursor-pointer transition-transform duration-300 ${
            isSignUp ? '-translate-y-16 rotate-[45deg]' : 'rotate-0'
          }`}
          onClick={() => setIsSignUp(false)}
        >
          <div className='bg-ski-boot-left mb-8 h-52 w-52' />
          <p
            className={`absolute bottom-0 left-16 text-2xl font-bold italic ${
              !isSignUp && 'ski-boot-bounce'
            }`}
          >
            Sign In
          </p>
        </div>
        <div
          className={`relative transform cursor-pointer transition-transform duration-300 ${
            !isSignUp ? '-translate-y-16 -rotate-[45deg]' : 'rotate-0'
          }`}
          onClick={() => setIsSignUp(true)}
        >
          <div className='bg-ski-boot-left mb-8 h-52 w-52' />
          <p
            className={`absolute bottom-0 left-16 text-2xl font-bold italic ${
              isSignUp && 'ski-boot-bounce'
            }`}
          >
            Sign Up
          </p>
        </div>
      </div>
      <div className='mb-16 flex h-full w-full flex-col items-center gap-8'>
        <div className='bg-ski-input flex h-[60px] w-[900px] cursor-pointer items-center pl-40 font-bold duration-300 hover:-translate-y-1'>
          <label className='w-36 cursor-pointer text-2xl italic text-white drop-shadow-[2px_1px_2px_rgba(0,0,0,0.7)]'>
            Email
          </label>
          <input
            className='h-6 w-2/5 rounded-lg bg-white/95 pl-4 text-xl italic'
            type='email'
            value={userEmail}
            onChange={(e) => handleEmail(e)}
          />
        </div>
        <div className='bg-ski-input flex h-[60px] w-[900px] cursor-pointer items-center pl-40 font-bold duration-300 hover:-translate-y-1'>
          <label className='w-36 cursor-pointer text-2xl italic text-white drop-shadow-[2px_1px_2px_rgba(0,0,0,0.7)]'>
            Password
          </label>
          <input
            className='h-6 w-2/5 rounded-lg bg-white/95 pl-4 text-xl'
            type='password'
            value={userPassword}
            onChange={(e) => handlePassword(e)}
          />
        </div>
      </div>
      {isSignUp ? (
        <div
          className='mb-2 flex cursor-pointer gap-2 font-bold'
          onClick={() => setIsSignUp(false)}
        >
          Already have an account?
        </div>
      ) : (
        <div className='mb-2 flex cursor-pointer gap-2 font-bold' onClick={() => setIsSignUp(true)}>
          <p>Don't have an account?</p>
          <p className='underline'>Sign up for free</p>
        </div>
      )}
      {isSignUp ? (
        <button
          className='h-fit w-fit rounded-full bg-zinc-600 p-4 text-xl font-bold text-white transition-transform hover:scale-105 hover:bg-black'
          onClick={() => handleSignUp()}
        >
          Sign Up
        </button>
      ) : (
        <button
          className='h-fit w-fit rounded-full bg-zinc-600 p-4 text-xl font-bold text-white transition-transform hover:scale-105 hover:bg-black'
          onClick={() => handleSignIn()}
        >
          Sign In
        </button>
      )}
    </div>
  )
}

export default SignIn
