import { getAuth, signOut } from 'firebase/auth'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useUserStore } from '../../store/useUser'
import DefaultUserIcon from './default-user-icon.png'
import Logo from './logo.png'
import Notification from './notification-icon.png'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const { isSignIn, userDoc } = useUserStore()
  const auth = getAuth()

  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const handleItemHover = (item: string): void => {
    setHoveredItem(item)
  }

  const handleItemLeave = (): void => {
    setHoveredItem(null)
  }

  const handleSignOut = async () => {
    await signOut(auth)
    toast.success('Sign out successed!', {
      position: 'top-right',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: 'light'
    })
    navigate('/')
  }

  return (
    <div className='flex justify-between bg-white pl-8 pr-8'>
      <div className='flex h-16 items-center'>
        <Link to='/'>
          <img src={Logo} alt='Logo' />
        </Link>
        <Link className='ml-2 cursor-pointer text-2xl font-bold italic' to='/'>
          Ski Run Map
        </Link>
        <div className='relative ml-8 flex h-full items-center gap-8 text-lg font-bold'>
          <div className='h-full' onMouseLeave={handleItemLeave}>
            <NavItem
              name='Route'
              url='/route'
              isHovered={hoveredItem === 'Route'}
              onMouseEnter={() => handleItemHover('Route')}
            />
            {hoveredItem === 'Route' && (
              <SubNavItem
                items={[
                  { name: 'Create Route', url: '/edit-route' },
                  { name: 'My Route', url: '/' }
                ]}
              />
            )}
          </div>
          <div className='h-full' onMouseLeave={handleItemLeave}>
            <NavItem
              name='Explore'
              url='/'
              isHovered={hoveredItem === 'Explore'}
              onMouseEnter={() => handleItemHover('Explore')}
            />
            {hoveredItem === 'Explore' && (
              <SubNavItem items={[{ name: 'Niseko Ski Resort', url: '/' }]} />
            )}
          </div>
        </div>
      </div>
      <div className='relative flex items-center'>
        <div onMouseLeave={handleItemLeave} className='h-full text-lg hover:translate-y-[-2px]'>
          <Link
            className={`flex h-full transform items-center transition-transform duration-200 focus:outline-none ${
              !isSignIn && 'pl-20'
            }`}
            to='/member'
            onMouseEnter={() => handleItemHover('Member')}
          >
            {isSignIn && userDoc.username && <p className='pr-2'>Hi, {userDoc.username}</p>}
            {isSignIn && !userDoc.username && <p className='pr-2'>Hi, please create a username</p>}
            {isSignIn ? (
              <img
                className='mr-2 h-6 w-6 rounded-full shadow-[4px_4px_20px_-4px_#4da5fd]'
                src={userDoc.userIconUrl}
                alt='User icon'
              />
            ) : (
              <img
                className='mr-2 h-6 w-6 rounded-full shadow-[4px_4px_20px_-4px_#4da5fd]'
                src={DefaultUserIcon}
                alt='User icon'
              />
            )}
          </Link>
          {hoveredItem === 'Member' && (
            <div className='absolute right-0 top-12 flex flex-col rounded-md bg-white p-2 font-normal shadow-lg'>
              <Link
                to='/member'
                className='bg-grey-700 w-max rounded-md pl-2 pr-2 hover:bg-zinc-100'
              >
                My Page
              </Link>
              <Link
                to='/member-info'
                className='bg-grey-700 w-max rounded-md pl-2 pr-2 hover:bg-zinc-100'
              >
                My Info
              </Link>
              <Link
                to='/friend'
                className='bg-grey-700 w-max rounded-md pl-2 pr-2 hover:bg-zinc-100'
              >
                My Friend
              </Link>
            </div>
          )}
        </div>

        <img className='mr-2 h-auto w-6' src={Notification} alt='Notification icon' />

        {isSignIn ? (
          <button
            className='h-fit w-fit rounded-2xl bg-zinc-300 pl-4 pr-4 text-lg font-bold'
            onClick={() => handleSignOut()}
          >
            Sign out
          </button>
        ) : (
          <Link
            className='h-fit w-fit rounded-2xl bg-zinc-300 pl-4 pr-4 text-lg font-bold'
            to='/signin'
          >
            Sign in
          </Link>
        )}
      </div>
    </div>
  )
}

interface NavItemProps {
  name: string
  url: string
  isHovered: boolean
  onMouseEnter: () => void
}

const NavItem: React.FC<NavItemProps> = ({ name, isHovered, url, onMouseEnter }) => {
  return (
    <Link
      className={`flex h-full transform items-center focus:outline-none ${
        isHovered ? 'translate-y-[-2px]' : 'translate-y-0'
      } transition-transform duration-200`}
      to={url}
      onMouseEnter={onMouseEnter}
    >
      {name}
    </Link>
  )
}

interface SubNavItemProps {
  items: Array<{ name: string; url: string }>
}

const SubNavItem: React.FC<SubNavItemProps> = ({ items }) => {
  return (
    <div className='absolute top-12 flex flex-col rounded-md bg-white p-2 font-normal shadow-lg'>
      {items.map(({ name, url }, index) => (
        <Link
          key={index}
          to={url}
          className='bg-grey-700 w-max rounded-md pl-2 pr-2 hover:bg-zinc-100'
        >
          {name}
        </Link>
      ))}
    </div>
  )
}

export default Header
