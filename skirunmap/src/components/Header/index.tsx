import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from './logo.png'
import Notification from './notification-icon.png'

const Header: React.FC = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const handleItemHover = (item: string) => {
    setHoveredItem(item)
  }

  const handleItemLeave = () => {
    setHoveredItem(null)
  }

  return (
    <div className='flex justify-between bg-white pl-8 pr-8'>
      <div className='flex items-center h-16'>
        <Link to='/'>
          <img src={Logo} alt='Logo' />
        </Link>
        <Link className='font-bold text-2xl italic ml-2 cursor-pointer' to='/'>
          Ski Run Map
        </Link>
        <div className='flex items-center ml-8 gap-8 font-bold text-lg relative h-full'>
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

          <div className='h-full' onMouseLeave={handleItemLeave}>
            <NavItem
              name='Route'
              url='/route'
              isHovered={hoveredItem === 'Route'}
              onMouseEnter={() => handleItemHover('Route')}
            />
            {hoveredItem === 'Route' && (
              <SubNavItem
                items={[{ name: 'Create Route', url: '/edit-route' }]}
              />
            )}
          </div>

          <div className='h-full' onMouseLeave={handleItemLeave}>
            <NavItem
              name='Member'
              url='/member'
              isHovered={hoveredItem === 'Member'}
              onMouseEnter={() => handleItemHover('Member')}
            />
            {hoveredItem === 'Member' && (
              <SubNavItem
                items={[
                  { name: 'My Page', url: '/member' },
                  { name: 'My Friend', url: '/friend' },
                ]}
              />
            )}
          </div>
        </div>
      </div>
      <div className='flex items-center'>
        <img
          className='w-6 h-auto mr-2'
          src={Notification}
          alt='Notification icon'
        />
        <button className='w-fit h-fit bg-zinc-300 rounded-2xl pl-4 pr-4'>
          Login
        </button>
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

const NavItem: React.FC<NavItemProps> = ({
  name,
  isHovered,
  url,
  onMouseEnter,
}) => {
  return (
    <Link
      className={`flex items-center h-full focus:outline-none transform ${
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
    <div className='flex flex-col gap-2 absolute top-14 font-normal bg-white shadow-lg rounded-md'>
      {items.map(({ name, url }, index) => (
        <Link key={index} to={url} className='bg-grey-700 p-2 w-max'>
          {name}
        </Link>
      ))}
    </div>
  )
}

export default Header
