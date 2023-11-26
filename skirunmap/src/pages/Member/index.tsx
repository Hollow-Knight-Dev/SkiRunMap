import ProfileIcon from './User-icon.png'
import LeftArrow from './left_arrow.png'
import RightArrow from './right_arrow.png'

const Member = () => {
  return (
    <div className='p-8'>
      <div className='w-full mb-8'>
        <div className='flex'>
          <img
            className='w-28 ml-10 mr-10'
            src={ProfileIcon}
            alt='Profile Icon'
          />
          <div className='flex w-full justify-between'>
            <div className='flex flex-col'>
              <p className='font-bold text-3xl mb-4'>I Am Groot</p>
              <div className='flex gap-1 mb-2'>
                <p className='font-bold text-xl'>Joined Time:</p>
                <p className='text-lg'>November 15, 2023</p>
              </div>
              <div className='flex gap-3'>
                <div className='flex gap-1'>
                  <p className='font-bold text-xl'>Routes:</p>
                  <p className='text-lg'>10</p>
                </div>
                <div className='flex gap-1'>
                  <p className='font-bold text-xl'>Views:</p>
                  <p className='text-lg'>10</p>
                </div>
                <div className='flex gap-1'>
                  <p className='font-bold text-xl'>Friends:</p>
                  <p className='text-lg'>10</p>
                </div>
                <div className='flex gap-1'>
                  <p className='font-bold text-xl'>Followers:</p>
                  <p className='text-lg'>10</p>
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <button className='w-20 h-fit bg-zinc-300 rounded-2xl pl-4 pr-4 text-lg font-bold'>
                Invite
              </button>
              <button className='w-20 h-fit bg-zinc-300 rounded-2xl pl-4 pr-4 text-lg font-bold'>
                Follow
              </button>
              {/* <button className='w-20 h-fit bg-zinc-300 rounded-2xl pl-4 pr-4 text-lg font-bold'>
                Invited
              </button>
              <button className='w-20 h-fit bg-zinc-300 rounded-2xl pl-4 pr-4 text-lg font-bold'>
                Following
              </button>
              <button className='w-20 h-fit bg-zinc-300 rounded-2xl pl-4 pr-4 text-lg font-bold'>
                Friend
              </button> */}
            </div>
          </div>
        </div>
      </div>
      <div className='w-full border border-zinc-300 mb-8' />
      <div className='mb-16'>
        <p className='font-bold text-2xl mb-8'>My Routes</p>
        <div className='flex justify-center items-center'>
          <img className='w-20 h-20' src={LeftArrow} alt='Left arrow' />
          <div className='w-fit grid grid-cols-4 gap-4'>
            <div className='w-40 h-40 bg-zinc-300 rounded-2xl'></div>
            <div className='w-40 h-40 bg-zinc-300 rounded-2xl'></div>
            <div className='w-40 h-40 bg-zinc-300 rounded-2xl'></div>
            <div className='w-40 h-40 bg-zinc-300 rounded-2xl'></div>
            <div className='w-40 h-40 bg-zinc-300 rounded-2xl'></div>
            <div className='w-40 h-40 bg-zinc-300 rounded-2xl'></div>
            <div className='w-40 h-40 bg-zinc-300 rounded-2xl'></div>
            <div className='w-40 h-40 bg-zinc-300 rounded-2xl'></div>
          </div>
          <img className='w-20 h-20' src={RightArrow} alt='Right arrow' />
        </div>
      </div>
      <div className='w-full border border-zinc-300 mb-8' />
      <div className='mb-16'>
        <p className='font-bold text-2xl mb-8'>My Favorite Routes</p>
        <div className='flex justify-center items-center'>
          <img className='w-20 h-20' src={LeftArrow} alt='Left arrow' />
          <div className='w-fit grid grid-cols-4 gap-4'>
            <div className='w-40 h-40 bg-zinc-300 rounded-2xl'></div>
            <div className='w-40 h-40 bg-zinc-300 rounded-2xl'></div>
            <div className='w-40 h-40 bg-zinc-300 rounded-2xl'></div>
            <div className='w-40 h-40 bg-zinc-300 rounded-2xl'></div>
            <div className='w-40 h-40 bg-zinc-300 rounded-2xl'></div>
            <div className='w-40 h-40 bg-zinc-300 rounded-2xl'></div>
            <div className='w-40 h-40 bg-zinc-300 rounded-2xl'></div>
            <div className='w-40 h-40 bg-zinc-300 rounded-2xl'></div>
          </div>
          <img className='w-20 h-20' src={RightArrow} alt='Right arrow' />
        </div>
      </div>
    </div>
  )
}

export default Member
