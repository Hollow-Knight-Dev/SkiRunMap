import SearchIcon from './search-icon.png'
import ProfileIcon from './User-icon.png'

const Friends = () => {
  return (
    <div className='p-8 flex flex-col'>
      <div className='w-1/3 relative mb-8 self-end'>
        <img
          className='absolute w-7 top-2 left-4'
          src={SearchIcon}
          alt='Search Icon'
        />
        <input
          className='w-full p-2 pl-16 border border-zinc-300 rounded-3xl'
          placeholder='Search user by username'
        />
      </div>
      <div className='mb-16'>
        <div className='w-full border border-zinc-300 mb-8' />
        <p className='font-bold text-2xl mb-8'>My Friend</p>
        <div className='flex justify-center items-center'>
          <div className='flex items-center'>
            <img
              className='w-20 h-20'
              src={ProfileIcon}
              alt='Friend Profile Icon'
            />
            <button className='w-20 h-10 bg-zinc-100'>YES</button>
            <button className='w-20 h-10 bg-zinc-100'>NO</button>
          </div>
        </div>
      </div>
      <div className='mb-16'>
        <div className='w-full border border-zinc-300 mb-8' />
        <p className='font-bold text-2xl mb-8'>Friend Request</p>
        <div className='flex justify-center items-center'>
          <div className='flex items-center'>
            <img
              className='w-20 h-20'
              src={ProfileIcon}
              alt='Friend Profile Icon'
            />
            <button className='w-20 h-10 bg-zinc-100'>YES</button>
            <button className='w-20 h-10 bg-zinc-100'>NO</button>
          </div>
        </div>
      </div>
      <div className='mb-16'>
        <div className='w-full border border-zinc-300 mb-8' />
        <p className='font-bold text-2xl mb-8'>Sent Invitation</p>
        <div className='flex justify-center items-center'>
          <div className='flex items-center'>
            <img
              className='w-20 h-20'
              src={ProfileIcon}
              alt='Friend Profile Icon'
            />
            <button className='w-20 h-10 bg-zinc-100'>YES</button>
            <button className='w-20 h-10 bg-zinc-100'>NO</button>
          </div>
        </div>
      </div>
      <div className='mb-16'>
        <div className='w-full border border-zinc-300 mb-8' />
        <p className='font-bold text-2xl mb-8'>Popular Users</p>
        <div className='flex justify-center items-center'>
          <div className='flex items-center'>
            <img
              className='w-20 h-20'
              src={ProfileIcon}
              alt='Friend Profile Icon'
            />
            <p className='w-40 bg-zinc-100 text-center'>I Am Not Groot</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Friends
