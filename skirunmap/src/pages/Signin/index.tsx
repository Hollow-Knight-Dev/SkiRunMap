import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useEffect, useState } from 'react'

const SignIn: React.FC = () => {
  const auth = getAuth()
  const [isSignUp, setIsSignUp] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  useEffect(() => {
    console.log(password)
  }, [password])

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.trim()
    setEmail(input)
  }

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.trim()
    setPassword(input)
  }

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user
        console.log(user)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user
        console.log(user)
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
            className='h-6 w-2/5 rounded-full bg-blue-500 pl-4 outline-0'
            type='email'
            value={email}
            onChange={(e) => handleEmail(e)}
          />
        </div>
        <div className='flex h-fit w-4/5 items-center justify-center rounded-full bg-blue-600 p-1 pl-4 text-lg text-white'>
          <label className='w-24'>Password</label>
          <input
            className='h-6 w-2/5 rounded-full bg-blue-500 pl-4 outline-0'
            type='text'
            value={password}
            onChange={(e) => handlePassword(e)}
          />
        </div>
      </div>
      {isSignUp ? (
        <button
          className='h-fit w-fit rounded-full bg-blue-500 p-4 text-white hover:bg-blue-600'
          onClick={() => handleSignUp()}
        >
          Sign Up
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
