import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='flex flex-wrap h-48 bg-zinc-100 justify-evenly pt-8'>
      <div className='flex flex-col'>
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
      </div>
      <p className='w-full h-fit text-center'>
        2023 SKIRUNMAP All Rights Reserved
      </p>
    </div>
  )
}

export default Footer
