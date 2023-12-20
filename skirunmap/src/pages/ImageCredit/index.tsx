import Notification from '../../components/Header/notification.png'
import BlueBird from '/images/bluebird.png'
import SearchIcon from '/images/search-icon.png'

const ImageCredit = () => {
  return (
    <div className='h-screen-64px flex flex-col items-center p-8'>
      <p className='mb-4 text-2xl font-bold'>Image Credit</p>
      <div className='mb-6 w-4/5 border border-zinc-300' />
      <div className='flex w-4/5 flex-wrap items-center justify-center gap-8'>
        <a href='https://www.flaticon.com/free-icons/email' title='email icons'>
          <img
            className='h-auto w-16'
            src={Notification}
            alt='Email icons created by Pixel perfect - Flaticon'
          />
        </a>
        <a href='https://www.flaticon.com/free-icons/bird' title='bird icons'>
          <img
            className='h-auto w-16'
            src={BlueBird}
            alt='Bird icons created by Freepik - Flaticon'
          />
        </a>
        <a href='https://www.flaticon.com/free-icons/search' title='search icons'>
          <img
            className='h-auto w-12'
            src={SearchIcon}
            alt='Search icons created by Pixel perfect - Flaticon'
          />
        </a>
      </div>
    </div>
  )
}

export default ImageCredit
