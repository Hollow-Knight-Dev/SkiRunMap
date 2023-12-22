import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { db, storage } from '../../auth/Firebase'
import { User, useUserStore } from '../../store/useUser'

const MemberInfo = () => {
  const navigate = useNavigate()
  const [isUpdated, setIsUpdated] = useState<boolean>(false)
  const {
    setUserDoc,
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
    }
  }, [userDoc])

  useEffect(() => {
    if (isUpdated) {
      // console.log('After updating member info userDoc:', userDoc)
      navigate(`/member/${userID}`)
    }
  }, [userDoc, isUpdated])

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
    const input = e.target.value
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
    if (username.trim() !== '') {
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
      await updateDoc(userRef, data)
      const userDoc = await getDoc(doc(db, 'users', userID))
      const userDocData = userDoc.data() as User
      setUserDoc(userDocData)
      setIsUpdated(true)

      toast.success('Updated personal info!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'light'
      })
    } else {
      toast.warn('Username cannot be empty', {
        position: 'top-right',
        autoClose: 3000,
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
    <div className='h-screen-64px bg-groomed-piste flex flex-col items-center justify-center bg-blue-100'>
      <div className='flex w-4/5 flex-col items-center gap-12'>
        <div className='relative h-fit w-28'>
          <label
            htmlFor='userIcon'
            className='h-28 w-28 cursor-pointer'
            onMouseLeave={() => setIsHoverOnIcon(false)}
          >
            <img
              src={userIconUrl}
              alt='User icon'
              className={`h-28 w-28 rounded-full object-cover shadow-[0px_0px_15px_-5px_#ffffff] duration-100 ${
                isHoverOnIcon && 'opacity-70'
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

        <div className='flex h-full w-full flex-col items-center gap-4'>
          <div className='bg-ski-input flex h-[60px] w-[900px] items-center pl-[140px] font-bold duration-300 hover:-translate-y-1'>
            <label className='w-52 text-xl italic text-white drop-shadow-[2px_1px_2px_rgba(0,0,0,0.7)]'>
              Username
            </label>
            <input
              className='h-6 w-2/5 rounded-lg bg-white/90 pl-4'
              type='text'
              value={username}
              onChange={(e) => handleUsername(e)}
            />
          </div>
          <div className='bg-ski-input flex h-[60px] w-[900px] items-center pl-[140px] font-bold duration-300 hover:-translate-y-1'>
            <label className='w-52 text-xl italic text-white drop-shadow-[2px_1px_2px_rgba(0,0,0,0.7)]'>
              Ski age
            </label>
            <input
              className='h-6 w-2/5 rounded-lg bg-white/90 pl-4'
              type='text'
              value={userSkiAge}
              onChange={(e) => handleSkiAge(e)}
            />
          </div>
          <div className='bg-ski-input flex h-[60px] w-[900px] items-center pl-[140px] font-bold duration-300 hover:-translate-y-1'>
            <label className='w-52 text-xl italic text-white drop-shadow-[2px_1px_2px_rgba(0,0,0,0.7)]'>
              Snowboard age
            </label>
            <input
              className='h-6 w-2/5 rounded-lg bg-white/90 pl-4'
              type='text'
              value={userSnowboardAge}
              onChange={(e) => handleSnowboardAge(e)}
            />
          </div>
          <div className='bg-ski-input flex h-[60px] w-[900px] items-center pl-[140px] font-bold duration-300 hover:-translate-y-1'>
            <label className='w-52 text-xl italic text-white drop-shadow-[2px_1px_2px_rgba(0,0,0,0.7)]'>
              Country
            </label>
            <input
              className='h-6 w-2/5 rounded-lg bg-white/90 pl-4'
              type='text'
              value={userCountry}
              onChange={(e) => handleCountry(e)}
            />
          </div>
          <div className='bg-ski-input flex h-[60px] w-[900px] items-center pl-[140px] font-bold duration-300 hover:-translate-y-1'>
            <label className='w-52 text-xl italic text-white drop-shadow-[2px_1px_2px_rgba(0,0,0,0.7)]'>
              Gender
            </label>
            <input
              className='h-6 w-2/5 rounded-lg bg-white/90 pl-4'
              type='text'
              value={userGender}
              onChange={(e) => handleGender(e)}
            />
          </div>
          <div className='bg-ski-input flex h-[60px] w-[900px] items-center pl-[140px] font-bold duration-300 hover:-translate-y-1'>
            <label className='w-52 text-xl italic text-white drop-shadow-[2px_1px_2px_rgba(0,0,0,0.7)]'>
              About me
            </label>
            <input
              className='h-6 w-2/5 rounded-lg bg-white/90 pl-4'
              type='text'
              value={userDescription}
              onChange={(e) => handleDescription(e)}
            />
          </div>
        </div>

        {/* <div className='mb-8 flex w-5/6 flex-col items-center gap-8'>
          <div className='flex w-full flex-col gap-2'>
            <div className='nice-shadow flex h-fit items-center justify-center rounded-full bg-blue-600 p-1 pl-4 text-lg text-white'>
              <label className='w-48'>Username</label>
              <input
                className='h-6 w-3/5 rounded-full bg-blue-500 pl-4'
                type='text'
                value={username}
                onChange={(e) => handleUsername(e)}
              />
            </div>
            <div className='nice-shadow flex h-fit items-center justify-center rounded-full bg-blue-600 p-1 pl-4 text-lg text-white'>
              <label className='w-48'>Ski age</label>
              <input
                className='h-6 w-3/5 rounded-full bg-blue-500 pl-4'
                type='text'
                value={userSkiAge}
                onChange={(e) => handleSkiAge(e)}
              />
            </div>
          </div>

          <div className='nice-shadow flex h-fit w-full items-center justify-center rounded-full bg-blue-600 p-1 pl-4 text-lg text-white'>
            <label className='w-48'>Snowboard age</label>
            <input
              className='mb-1 mt-1 h-12 w-3/5 rounded-full bg-blue-500 pl-4'
              type='text'
              value={userSnowboardAge}
              onChange={(e) => handleSnowboardAge(e)}
            />
          </div>

          <div className='flex w-full flex-col gap-2'>
            <div className='nice-shadow flex h-fit items-center justify-center rounded-full bg-blue-600 p-1 pl-4 text-lg text-white'>
              <label className='w-48'>Country</label>
              <input
                className='h-6 w-3/5 rounded-full bg-blue-500 pl-4'
                type='text'
                value={userCountry}
                onChange={(e) => handleCountry(e)}
              />
            </div>
            <div className='nice-shadow flex h-fit items-center justify-center rounded-full bg-blue-600 p-1 pl-4 text-lg text-white'>
              <label className='w-48'>Gender</label>
              <input
                className='h-6 w-3/5 rounded-full bg-blue-500 pl-4'
                type='text'
                value={userGender}
                onChange={(e) => handleGender(e)}
              />
            </div>
          </div>

          <div className='nice-shadow flex h-fit w-full items-center justify-center rounded-full bg-blue-600 p-1 pl-4 text-lg text-white'>
            <label className='w-48'>About me</label>
            <input
              className='mb-1 mt-1 h-12 w-3/5 rounded-full bg-blue-500 pl-4'
              type='text'
              value={userDescription}
              onChange={(e) => handleDescription(e)}
            />
          </div>
        </div> */}
      </div>
      <div className='mt-12 flex gap-8'>
        <button
          className='nice-shadow h-fit w-fit rounded-full bg-zinc-600 pb-2 pl-4 pr-4 pt-2 text-xl font-bold text-white transition-transform hover:scale-105 hover:bg-black'
          onClick={() => handleMemberInfoSubmit()}
        >
          Save profile
        </button>
      </div>
    </div>
  )
}

export default MemberInfo
