import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='flex h-48 flex-wrap justify-evenly bg-zinc-100 pt-12'>
      {/* <div className='flex flex-col'>
        <Link className='font-bold text-lg mb-2' to='/'>
          Explore
        </Link>
        <div className='flex flex-col'>
          <Link className='text-lg' to='/'>
            Niseko Ski Resort
          </Link>
        </div>
      </div>
      <div className='flex flex-col'>
        <Link className='font-bold text-lg mb-2' to='/route'>
          Route
        </Link>
        <div className='flex flex-col'>
          <Link className='text-lg' to='/edit-route'>
            Create Route
          </Link>
        </div>
      </div>
      <div className='flex flex-col'>
        <Link className='font-bold text-lg mb-2' to='/member'>
          Member
        </Link>
        <div className='flex flex-col'>
          <Link className='text-lg' to='/member'>
            My Page
          </Link>
          <Link className='text-lg' to='/friend'>
            My Friend
          </Link>
        </div>
      </div> */}
      <Link className='text-lg font-bold' to='/credit'>
        Image Credit
      </Link>
      <p className='h-fit w-full text-center'>2023 SKIRUNMAP All Rights Reserved</p>
    </div>
  )
}

export default Footer
