import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../../auth/Firebase'
import { User, useUserStore } from '../../store/useUser'
import showToast from '../../utils/showToast'

const defaultUserIconUrl =
  'https://firebasestorage.googleapis.com/v0/b/skirunmap.appspot.com/o/default-user-icon.png?alt=media&token=d4a1a132-603a-4e91-9adf-2623dda20777'

const SignIn: React.FC = () => {
  const navigate = useNavigate()
  const auth = getAuth()
  const [isSignUp, setIsSignUp] = useState<boolean>(false)
  const { userID, setUserID, userEmail, setUserEmail, userPassword, setUserPassword } =
    useUserStore()

  useEffect(() => {}, [userID])

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
      showToast('warn', 'Please enter correct email format.')
      return false
    }
  }

  const handleSignUp = () => {
    if (handleEmailValidation(userEmail)) {
      createUserWithEmailAndPassword(auth, userEmail, userPassword)
        .then(async (userCredential) => {
          const userID = userCredential.user.uid
          setUserID(userID)

          const data: User = {
            userID: userID,
            userEmail: userEmail,
            userJoinedTime: serverTimestamp(),
            username: '',
            userIconUrl: defaultUserIconUrl,
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
          showToast('success', 'Sign up successed!', () => {
            navigate('/member-info')
          })
        })
        .catch((error) => {
          console.log('Firebase authentication sign up error')
          console.error(error)

          if (error.code === 'auth/email-already-in-use') {
            showToast('warn', 'Email has been signed up.')
          } else if (error.code === 'auth/weak-password') {
            showToast('warn', 'Please use stronger password (at least 6 characters)')
          }
        })
    }
  }

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, userEmail, userPassword)
      const userID = userCredential.user.uid
      const userDoc = await getDoc(doc(db, 'users', userID))

      if (userDoc.data()?.userFinishedInfo) {
        showToast('success', `Welcome back, ${userDoc.data()?.username}`)
      } else {
        showToast('warn', "You haven't finish your profile.")
      }
    } catch (error) {
      showToast('warn', 'Incorrect email or password')
    }
  }

  return (
    <div className='max-h-screen-contain-header bg-groomed-piste flex w-full flex-col items-center justify-center'>
      <div className='flex flex-col items-center gap-6'>
        <div className='mt-12 flex'>
          <div
            className={`relative transform cursor-pointer transition-transform duration-300 ${
              isSignUp ? '-translate-y-16 rotate-[45deg]' : 'rotate-0'
            }`}
            onClick={() => setIsSignUp(false)}
          >
            <div className='bg-ski-boot-left mb-8 h-52 w-52 duration-300 hover:-translate-y-1' />
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
            <div className='bg-ski-boot-left mb-8 h-52 w-52 duration-300 hover:-translate-y-1' />
            <p
              className={`absolute bottom-0 left-16 text-2xl font-bold italic ${
                isSignUp && 'ski-boot-bounce'
              }`}
            >
              Sign Up
            </p>
          </div>
        </div>

        <div className='flex h-full w-full flex-col items-center gap-8'>
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
          <div className='mt-4 flex flex-col items-center'>
            <div
              className='mb-2 flex cursor-pointer gap-2 font-bold'
              onClick={() => setIsSignUp(false)}
            >
              Already have an account?
            </div>
            <button
              className='h-fit w-fit rounded-full bg-zinc-600 p-4 text-xl font-bold text-white transition-transform hover:scale-105 hover:bg-black'
              onClick={() => handleSignUp()}
            >
              Sign Up
            </button>
          </div>
        ) : (
          <div className='mt-4 flex flex-col items-center'>
            <div
              className='mb-2 flex cursor-pointer gap-2 font-bold'
              onClick={() => setIsSignUp(true)}
            >
              <p>Don't have an account?</p>
              <p className='underline'>Sign up for free</p>
            </div>
            <button
              className='h-fit w-fit rounded-full bg-zinc-600 p-4 text-xl font-bold text-white transition-transform hover:scale-105 hover:bg-black'
              onClick={() => handleSignIn()}
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SignIn
