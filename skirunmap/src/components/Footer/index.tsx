import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='flex h-24 flex-wrap items-center justify-evenly bg-zinc-100 p-2  font-bold'>
      <div className='flex gap-4'>
        <Link className='text-lg' to='/credit'>
          Image Credit
        </Link>
      </div>
      <div className='h-7 w-[2px] bg-zinc-300'></div>
      <p className='h-fit w-80 text-center'>2024 SKIRUNMAP All Rights Reserved</p>
    </div>
  )
}

export default Footer
