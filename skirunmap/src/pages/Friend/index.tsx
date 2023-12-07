import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useUserStore } from '../../store/useUser'
import ProfileIcon from './User-icon.png'
import SearchIcon from './search-icon.png'

const Friends = () => {
  const navigate = useNavigate()
  const { isSignIn, userDoc, isLoadedUserDoc } = useUserStore()

  useEffect(() => {
    if (isLoadedUserDoc && !isSignIn) {
      toast.warn('Please sign in to view your friends', {
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

  return (
    <div className='flex flex-col p-8'>
      <div className='relative mb-8 w-1/3 self-end'>
        <img className='absolute left-4 top-2 w-7' src={SearchIcon} alt='Search Icon' />
        <input
          className='w-full rounded-3xl border border-zinc-300 p-2 pl-16'
          placeholder='Search user by username'
        />
      </div>
      <div className='mb-16'>
        <div className='mb-8 w-full border border-zinc-300' />
        <p className='mb-8 text-2xl font-bold'>My Friend</p>
        <div className='flex items-center justify-center'>
          <div className='flex items-center'>
            <img className='h-20 w-20' src={ProfileIcon} alt='Friend Profile Icon' />
            <button className='h-10 w-20 bg-zinc-100'>YES</button>
            <button className='h-10 w-20 bg-zinc-100'>NO</button>
          </div>
        </div>
      </div>
      <div className='mb-16'>
        <div className='mb-8 w-full border border-zinc-300' />
        <p className='mb-8 text-2xl font-bold'>Friend Request</p>
        <div className='flex items-center justify-center'>
          <div className='flex items-center'>
            <img className='h-20 w-20' src={ProfileIcon} alt='Friend Profile Icon' />
            <button className='h-10 w-20 bg-zinc-100'>YES</button>
            <button className='h-10 w-20 bg-zinc-100'>NO</button>
          </div>
        </div>
      </div>
      <div className='mb-16'>
        <div className='mb-8 w-full border border-zinc-300' />
        <p className='mb-8 text-2xl font-bold'>Sent Invitation</p>
        <div className='flex items-center justify-center'>
          <div className='flex items-center'>
            <img className='h-20 w-20' src={ProfileIcon} alt='Friend Profile Icon' />
            <button className='h-10 w-20 bg-zinc-100'>YES</button>
            <button className='h-10 w-20 bg-zinc-100'>NO</button>
          </div>
        </div>
      </div>
      <div className='mb-16'>
        <div className='mb-8 w-full border border-zinc-300' />
        <p className='mb-8 text-2xl font-bold'>Popular Users</p>
        <div className='flex items-center justify-center'>
          <div className='flex items-center'>
            <img className='h-20 w-20' src={ProfileIcon} alt='Friend Profile Icon' />
            <p className='w-40 bg-zinc-100 text-center'>I Am Not Groot</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Friends
