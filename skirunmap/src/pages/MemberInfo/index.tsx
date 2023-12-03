import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
// import { useLocation } from 'react-router-dom'
import { storage } from '../../auth/CloudStorage'
import { useUserStore } from '../../store/useUser'

const MemberInfo = () => {
  const {
    userID,
    setUserID,
    userEmail,
    setUserEmail,
    userPassword,
    setUserPassword,
    userIconUrl,
    setUserIconUrl
  } = useUserStore()

  // useEffect(() => {
  //   const location = useLocation()
  //   const { signUpUid, signUpEmail, signUpPassword } = location.state
  //   setUserID(signUpUid)
  //   setUserEmail(signUpEmail)
  //   setUserPassword(signUpPassword)
  // }, [])

  const uploadAndDownloadImage = async (file: File, fileName: string) => {
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
        uploadAndDownloadImage(file, userID)
      } else {
        alert('Invalid file type. Please upload an image.')
      }
    } else {
      alert('Please select an image.')
      return
    }
  }

  return (
    <div className='h-screen-256px flex flex-col items-center justify-center bg-zinc-200'>
      <div className='flex w-4/5 gap-8'>
        <div className='w-1/6'>
          <label
            htmlFor='userIcon'
            className='cursor-pointer rounded-r-2xl pr-4 underline underline-offset-2'
          >
            <img src={userIconUrl} alt='Default user icon' />
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
                // value={password}
                // onChange={(e) => handlePassword(e)}
              />
            </div>
            <div className='flex h-fit items-center justify-center rounded-full bg-blue-600 p-1 pl-4 text-lg text-white'>
              <label className='w-48'>Ski age</label>
              <input
                className='h-6 w-3/5 rounded-full bg-blue-500 pl-4'
                type='text'
                // value={password}
                // onChange={(e) => handlePassword(e)}
              />
            </div>
          </div>

          <div className='flex h-fit w-full items-center justify-center rounded-full bg-blue-600 p-1 pl-4 text-lg text-white'>
            <label className='w-48'>Snowboard age</label>
            <input
              className='mb-1 mt-1 h-12 w-3/5 rounded-full bg-blue-500 pl-4'
              type='text'
              // value={password}
              // onChange={(e) => handlePassword(e)}
            />
          </div>

          <div className='flex w-full flex-col gap-2'>
            <div className='flex h-fit items-center justify-center rounded-full bg-blue-600 p-1 pl-4 text-lg text-white'>
              <label className='w-48'>Country</label>
              <input
                className='h-6 w-3/5 rounded-full bg-blue-500 pl-4'
                type='text'
                // value={password}
                // onChange={(e) => handlePassword(e)}
              />
            </div>
            <div className='flex h-fit items-center justify-center rounded-full bg-blue-600 p-1 pl-4 text-lg text-white'>
              <label className='w-48'>Gender</label>
              <input
                className='h-6 w-3/5 rounded-full bg-blue-500 pl-4'
                type='text'
                // value={password}
                // onChange={(e) => handlePassword(e)}
              />
            </div>
          </div>

          <div className='flex h-fit w-full items-center justify-center rounded-full bg-blue-600 p-1 pl-4 text-lg text-white'>
            <label className='w-48'>About me</label>
            <input
              className='mb-1 mt-1 h-12 w-3/5 rounded-full bg-blue-500 pl-4'
              type='text'
              // value={password}
              // onChange={(e) => handlePassword(e)}
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
        <button className='h-fit w-fit rounded-full bg-blue-500 p-4 text-white hover:bg-blue-600'>
          Submit
        </button>
      </div>
    </div>
  )
}

export default MemberInfo
