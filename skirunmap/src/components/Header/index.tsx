import { Image } from '@nextui-org/react'
import { getAuth, signOut } from 'firebase/auth'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../../images/logo.png'
import { useUserStore } from '../../store/useUser'
import showToast from '../../utils/showToast'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const { isSignIn, userDoc, setIsSignIn, setIsLoadedUserDoc } = useUserStore()
  const auth = getAuth()

  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const handleItemHover = (item: string): void => {
    setHoveredItem(item)
  }

  const handleItemLeave = (): void => {
    setHoveredItem(null)
  }

  const handleSignOut = async () => {
    setIsSignIn(false)
    setIsLoadedUserDoc(false)
    navigate('/signin')
    await signOut(auth)
    handleItemLeave()
    showToast('success', 'Sign out.')
  }

  return (
    <div className='flex justify-between bg-white pl-5 pr-5 shadow-[3px_3px_7px_-6px_#7e7e7e]'>
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
                  { name: 'My Route', url: `/member/${userDoc?.userID}` }
                ]}
              />
            )}
          </div>
        </div>
      </div>
      <div className='relative flex items-center'>
        <div onMouseLeave={handleItemLeave} className='h-full'>
          <Link
            className={`flex h-full items-center font-bold transition-transform duration-200 focus:outline-none ${
              hoveredItem === 'Member' && 'translate-y-[-2px] italic'
            }`}
            to={isSignIn ? `/member/${userDoc?.userID}` : '/signin'}
            onMouseEnter={() => handleItemHover('Member')}
          >
            {isSignIn && userDoc?.username && (
              <p className='pr-3 text-lg'>Hi, {userDoc?.username}</p>
            )}
            {isSignIn && (
              <Image
                className='h-10 w-10 rounded-full object-cover shadow-[2px_2px_8px_-4px_#000]'
                src={userDoc?.userIconUrl}
                alt='User icon'
              />
            )}
          </Link>
          {hoveredItem === 'Member' && isSignIn && (
            <div className='absolute right-0 top-[60px] flex w-36 flex-col rounded-lg bg-white p-2 text-base leading-8 shadow-[1px_1px_5px_-1px_#7e7e7e]'>
              <Link
                to={`/member/${userDoc?.userID}`}
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
              <button
                className='bg-grey-700 w-full rounded-md pl-2 pr-2 text-start hover:bg-zinc-100'
                onClick={() => handleSignOut()}
              >
                Sign out
              </button>
            </div>
          )}
        </div>

        {!isSignIn && (
          <Link
            className='h-fit w-fit rounded-2xl bg-zinc-200 pl-4 pr-4 text-lg font-bold hover:bg-zinc-300'
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
