import { getAuth, signOut } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useUserStore } from '../../store/useUser'
import DefaultUserIcon from './default-user-icon.png'
import Logo from './logo.png'
import Notification from './notification.png'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const { isSignIn, userDoc, setIsSignIn } = useUserStore()
  const auth = getAuth()

  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const handleItemHover = (item: string): void => {
    setHoveredItem(item)
  }

  const handleItemLeave = (): void => {
    setHoveredItem(null)
  }

  const handleSignOut = async () => {
    navigate('/')
    await signOut(auth)
    setIsSignIn(false)
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
  }

  useEffect(() => {}, [userDoc])

  return (
    <div className='flex justify-between bg-white pl-8 pr-8'>
      <div className='flex h-16 items-center'>
        <Link to='/'>
          <img src={Logo} alt='Logo' />
        </Link>
        <Link className='ml-2 w-[135px] cursor-pointer text-2xl font-bold italic' to='/'>
          Ski Run Map
        </Link>
        <div className='ital relative ml-12 flex h-full items-center gap-8 text-lg'>
          <div className='h-full' onMouseLeave={handleItemLeave}>
            <NavItem
              name='Route'
              url='/'
              isHovered={hoveredItem === 'Route'}
              onMouseEnter={() => handleItemHover('Route')}
            />
            {hoveredItem === 'Route' && (
              <SubNavItem
                items={[
                  { name: 'Create New Route', url: '/edit-route' },
                  { name: 'My Draft Route', url: `/member/${userDoc.userID}` },
                  { name: 'My Route', url: `/member/${userDoc.userID}` },
                  { name: 'Followed User Routes', url: '/' },
                  { name: 'Friend Routes', url: '/' }
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
              <SubNavItem
                items={[
                  { name: 'Niseko Ski Resort', url: '/' },
                  { name: 'Popular Users', url: '/' }
                ]}
              />
            )}
          </div>
        </div>
      </div>
      <div className='relative flex items-center'>
        <div onMouseLeave={handleItemLeave} className='h-full'>
          <Link
            className={`flex h-full items-center font-bold transition-transform duration-200 hover:translate-y-[-2px] hover:italic focus:outline-none ${
              !isSignIn && 'pl-20'
            }`}
            to={isSignIn ? `/member/${userDoc.userID}` : '/signin'}
            onMouseEnter={() => handleItemHover('Member')}
          >
            {isSignIn && userDoc.username && <p className='pr-3 text-lg'>Hi, {userDoc.username}</p>}
            {isSignIn ? (
              <img
                className='h-8 w-8 rounded-full object-cover shadow-[2px_2px_10px_-2px_#4da5fd]'
                src={userDoc.userIconUrl}
                alt='User icon'
              />
            ) : (
              <img
                className='h-8 w-8 rounded-full shadow-[4px_4px_20px_-4px_#4da5fd]'
                src={DefaultUserIcon}
                alt='User icon'
              />
            )}
          </Link>
          {hoveredItem === 'Member' && isSignIn && (
            <div className='absolute top-[60px] flex w-48 flex-col rounded-lg bg-white p-2 text-base leading-8 shadow-[1px_1px_5px_-1px_#7e7e7e]'>
              <Link
                to={`/member/${userDoc.userID}`}
                className='bg-grey-700 w-full rounded-md pl-2 pr-2 hover:bg-zinc-100'
              >
                My Page
              </Link>
              <Link
                to='/friend'
                className='bg-grey-700 w-full rounded-md pl-2 pr-2 hover:bg-zinc-100'
              >
                My Friend
              </Link>
            </div>
          )}
        </div>

        <img
          className='ml-4 mr-4 h-auto w-7 cursor-pointer duration-200 hover:translate-y-[-2px]'
          src={Notification}
          alt='Notification icon'
        />

        {isSignIn ? (
          <button
            className='h-fit w-fit rounded-2xl bg-zinc-300 pl-4 pr-4 text-lg font-bold transition-transform duration-200 hover:translate-y-[-2px]'
            onClick={() => handleSignOut()}
          >
            Sign out
          </button>
        ) : (
          <Link
            className='h-fit w-fit rounded-2xl bg-zinc-300 pl-4 pr-4 text-lg font-bold transition-transform duration-200 hover:translate-y-[-2px]'
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
      className={`flex h-full transform items-center text-xl font-bold focus:outline-none ${
        isHovered ? 'translate-y-[-2px] italic' : 'translate-y-0'
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
    <div className='absolute top-[60px] flex w-48 flex-col rounded-lg bg-white p-2 text-base leading-8 shadow-[1px_1px_5px_-1px_#7e7e7e]'>
      {items.map(({ name, url }, index) => (
        <Link
          key={index}
          to={url}
          className='bg-grey-700 w-full rounded-md pl-2 pr-2 hover:bg-zinc-100'
        >
          {name}
        </Link>
      ))}
    </div>
  )
}

export default Header
