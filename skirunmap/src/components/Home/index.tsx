import { useState } from 'react'
import SearchIcon from './search-icon.png'
import SnowMountain from './snow-mountain.png'

const Home = () => {
  const [hasFilter, setHasFilter] = useState(false)

  const handleClick = () => {
    setHasFilter(true)
  }

  const handleMouseLeave = () => {
    setHasFilter(false)
  }

  return (
    <div className='flex flex-col items-center'>
      <div className='relative'>
        <div className='w-screen flex flex-col items-center absolute top-24'>
          <p className='font-bold text-3xl'>Find routes</p>
          <div className='w-2/3 relative'>
            <img
              className='absolute w-7 top-2 left-4'
              src={SearchIcon}
              alt='Search Icon'
            />
            <input
              className='w-full p-2 pl-16 border border-zinc-300 rounded-3xl'
              placeholder='Search by ski resort, ski run, or other tag name '
            />
          </div>
        </div>
        <div className='h-100'>
          <img src={SnowMountain} alt='Snow Mountain' />
        </div>
      </div>
      <div className='w-fit p-8 flex flex-col items-center'>
        <div className='w-full flex justify-between mb-2'>
          <p className='font-bold text-3xl'>Hottest routes</p>
          <div
            className='flex items-center gap-2 relative'
            onClick={handleClick}
            onMouseLeave={handleMouseLeave}
          >
            <p className='font-bold text-xl'>filter</p>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              className='h-full w-6 text-gray-600 cursor-pointer'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 6h16M6 12h12M8 18h8'
              />
            </svg>
            {hasFilter && (
              <div className='flex flex-col items-center absolute top-8 right-0 bg-white shadow-lg rounded-md font-semibold w-20 pt-2 pb-2'>
                <button className='w-full cursor-pointer hover:bg-zinc-100'>
                  All
                </button>
                <button className='w-full cursor-pointer hover:bg-zinc-100'>
                  Hottest
                </button>
                <button className='w-full cursor-pointer hover:bg-zinc-100'>
                  Newest
                </button>
              </div>
            )}
          </div>
        </div>
        <div className='w-full border border-zinc-300 mb-6' />
        <div className='w-fit grid grid-cols-4 gap-4'>
          <div className='w-40 h-40 bg-zinc-300 rounded-2xl'></div>
          <div className='w-40 h-40 bg-zinc-300 rounded-2xl'></div>
          <div className='w-40 h-40 bg-zinc-300 rounded-2xl'></div>
          <div className='w-40 h-40 bg-zinc-300 rounded-2xl'></div>
          <div className='w-40 h-40 bg-zinc-300 rounded-2xl'></div>
          <div className='w-40 h-40 bg-zinc-300 rounded-2xl'></div>
          <div className='w-40 h-40 bg-zinc-300 rounded-2xl'></div>
          <div className='w-40 h-40 bg-zinc-300 rounded-2xl'></div>
          <div className='w-40 h-40 bg-zinc-300 rounded-2xl'></div>
          <div className='w-40 h-40 bg-zinc-300 rounded-2xl'></div>
          <div className='w-40 h-40 bg-zinc-300 rounded-2xl'></div>
          <div className='w-40 h-40 bg-zinc-300 rounded-2xl'></div>
        </div>
      </div>
    </div>
  )
}

export default Home
