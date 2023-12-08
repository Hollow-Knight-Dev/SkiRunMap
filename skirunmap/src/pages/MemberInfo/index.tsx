import { doc, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { db, storage } from '../../auth/CloudStorage'
import { User, useUserStore } from '../../store/useUser'

const MemberInfo = () => {
  const navigate = useNavigate()
  const {
    userID,
    userIconUrl,
    setUserIconUrl,
    username,
    setUsername,
    userSkiAge,
    setUserSkiAge,
    userSnowboardAge,
    setUserSnowboardAge,
    userCountry,
    setUserCountry,
    userGender,
    setUserGender,
    userDescription,
    setUserDescription,
    userDoc,
    isSignIn,
    isLoadedUserDoc
  } = useUserStore()

  useEffect(() => {
    if (isLoadedUserDoc && isSignIn) {
      setUserIconUrl(userDoc.userIconUrl)
      setUsername(userDoc.username)
      setUserSkiAge(userDoc.userSkiAge)
      setUserSnowboardAge(userDoc.userSnowboardAge)
      setUserCountry(userDoc.userCountry)
      setUserGender(userDoc.userGender)
      setUserDescription(userDoc.userDescription)
    } else if (isLoadedUserDoc && !isSignIn) {
      toast.warn('Please sign in to edit your info', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'light',
        onClose: () => {
          navigate('/signin')
        }
      })
    }
  }, [userDoc])

  const [isHoverOnIcon, setIsHoverOnIcon] = useState<boolean>(false)

  const uploadAndDownloadIcon = async (file: File, fileName: string) => {
    const usersRef = ref(storage, 'users')
    const userRef = ref(usersRef, userID)
    const userIconRef = ref(userRef, fileName)
    try {
      await uploadBytes(userIconRef, file)
      const url = await getDownloadURL(userIconRef)
      setUserIconUrl(url)
    } catch (error) {
      console.log('Failed to uplaod and download image file', error)
    }
  }

  const handleUserIcon = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target
    const files: FileList | null = fileInput.files

    if (files) {
      const file: File = files[0]
      if (file.name) {
        uploadAndDownloadIcon(file, userID)
      } else {
        alert('Invalid file type. Please upload an image.')
      }
    } else {
      alert('Please select an image.')
      return
    }
  }

  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.trim()
    setUsername(input)
  }

  const handleSkiAge = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.trim()
    setUserSkiAge(input)
  }

  const handleSnowboardAge = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.trim()
    setUserSnowboardAge(input)
  }

  const handleCountry = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setUserCountry(input)
  }

  const handleGender = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setUserGender(input)
  }

  const handleDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setUserDescription(input)
  }

  const handleMemberInfoSubmit = async () => {
    const userRef = doc(db, 'users', userID)
    const data: Partial<User> = {
      username: username,
      userIconUrl: userIconUrl,
      userSkiAge: userSkiAge,
      userSnowboardAge: userSnowboardAge,
      userCountry: userCountry,
      userGender: userGender,
      userDescription: userDescription,
      userFinishedInfo: true
    }
    console.log(data)
    await updateDoc(userRef, data)

    toast.success('Updated personal info!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: 'light',
      onClose: () => {
        navigate(`/member/${userID}`)
      }
    })
  }

  return (
    <div className='h-screen-64px flex flex-col items-center justify-center bg-zinc-200'>
      <div className='flex w-4/5 gap-12'>
        <div className='relative h-fit w-28'>
          <label
            htmlFor='userIcon'
            className='h-28 w-28 cursor-pointer'
            onMouseLeave={() => setIsHoverOnIcon(false)}
          >
            <img
              src={userIconUrl}
              alt='User icon'
              className={`h-28 w-28 rounded-full object-cover shadow-[10px_15px_30px_-10px_#4da5fd] duration-100 ${
                isHoverOnIcon && 'opacity-30'
              }`}
              onMouseEnter={() => setIsHoverOnIcon(true)}
            />
            {isHoverOnIcon && (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='black'
                className='absolute inset-1/2 z-10 h-8 w-8 -translate-x-1/2 -translate-y-1/2'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5'
                />
              </svg>
            )}
          </label>
          <input
            className='hidden'
            type='file'
            id='userIcon'
            onChange={(e) => handleUserIcon(e)}
            accept='image/jpeg, image/png, image/svg+xml'
          />
        </div>
        <div className='mb-8 flex w-5/6 flex-col items-center gap-8'>
          <div className='flex w-full flex-col gap-2'>
            <div className='flex h-fit items-center justify-center rounded-full bg-blue-600 p-1 pl-4 text-lg text-white'>
              <label className='w-48'>Username</label>
              <input
                className='h-6 w-3/5 rounded-full bg-blue-500 pl-4'
                type='text'
                value={username}
                onChange={(e) => handleUsername(e)}
              />
            </div>
            <div className='flex h-fit items-center justify-center rounded-full bg-blue-600 p-1 pl-4 text-lg text-white'>
              <label className='w-48'>Ski age</label>
              <input
                className='h-6 w-3/5 rounded-full bg-blue-500 pl-4'
                type='text'
                value={userSkiAge}
                onChange={(e) => handleSkiAge(e)}
              />
            </div>
          </div>

          <div className='flex h-fit w-full items-center justify-center rounded-full bg-blue-600 p-1 pl-4 text-lg text-white'>
            <label className='w-48'>Snowboard age</label>
            <input
              className='mb-1 mt-1 h-12 w-3/5 rounded-full bg-blue-500 pl-4'
              type='text'
              value={userSnowboardAge}
              onChange={(e) => handleSnowboardAge(e)}
            />
          </div>

          <div className='flex w-full flex-col gap-2'>
            <div className='flex h-fit items-center justify-center rounded-full bg-blue-600 p-1 pl-4 text-lg text-white'>
              <label className='w-48'>Country</label>
              <input
                className='h-6 w-3/5 rounded-full bg-blue-500 pl-4'
                type='text'
                value={userCountry}
                onChange={(e) => handleCountry(e)}
              />
            </div>
            <div className='flex h-fit items-center justify-center rounded-full bg-blue-600 p-1 pl-4 text-lg text-white'>
              <label className='w-48'>Gender</label>
              <input
                className='h-6 w-3/5 rounded-full bg-blue-500 pl-4'
                type='text'
                value={userGender}
                onChange={(e) => handleGender(e)}
              />
            </div>
          </div>

          <div className='flex h-fit w-full items-center justify-center rounded-full bg-blue-600 p-1 pl-4 text-lg text-white'>
            <label className='w-48'>About me</label>
            <input
              className='mb-1 mt-1 h-12 w-3/5 rounded-full bg-blue-500 pl-4'
              type='text'
              value={userDescription}
              onChange={(e) => handleDescription(e)}
            />
          </div>

          {/* <div className='mb-8 flex w-full flex-col gap-2'>
            <div className='flex h-fit items-center justify-center rounded-full bg-blue-600 p-1 pl-4 text-lg text-white'>
              <label className='w-48'>Email</label>
              <input
                className='h-6 w-3/5 rounded-full bg-blue-500 pl-4'
                type='email'
                // value={email}
                // onChange={(e) => handleEmail(e)}
              />
            </div>
            <div className='flex h-fit items-center justify-center rounded-full bg-blue-600 p-1 pl-4 text-lg text-white'>
              <label className='w-48'>Password</label>
              <input
                className='h-6 w-3/5 rounded-full bg-blue-500 pl-4'
                type='text'
                // value={password}
                // onChange={(e) => handlePassword(e)}
              />
            </div>
          </div> */}
        </div>
      </div>
      <div className='flex gap-8'>
        <button
          className='h-fit w-fit rounded-full bg-blue-500 p-4 text-white hover:bg-blue-600'
          onClick={() => handleMemberInfoSubmit()}
        >
          Save profile
        </button>
      </div>
    </div>
  )
}

export default MemberInfo
