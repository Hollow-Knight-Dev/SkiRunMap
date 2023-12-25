import SkiIcon from '../../images/skiing-icon.png'
import SnowboardIcon from '../../images/snowboarder-icon.png'

interface NavItemProps {
  filter: string
  navItemName: string
  img: string
  onClick: () => void
}

const imgOption: { [key: string]: string } = {
  ski: SkiIcon,
  snowboard: SnowboardIcon
}

export const NavItem: React.FC<NavItemProps> = ({ filter, navItemName, img, onClick }) => {
  return (
    <div className='flex items-center gap-1 rounded-lg'>
      {filter === navItemName && (
        <img src={imgOption[img]} alt='nav item icon' className='slide-icon h-5 w-5' />
      )}
      <p
        className={`w-full cursor-pointer p-1 ${
          filter === navItemName && 'slide-nav-item font-bold'
        }`}
        onClick={onClick}
      >
        {navItemName}
      </p>
    </div>
  )
}
