import { Skeleton } from '@nextui-org/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

interface UserSimpleData {
  userID: string
  username: string
  userIconUrl: string
}

export interface UserListProps {
  list: UserSimpleData[] | undefined
  navItemTitle: string
  firstBtnName?: string
  firstBtnOnClick?: (userID: string) => void
  mainBtnName: string
  mainBtnOnClick: (userID: string) => void
}

export const UserList: React.FC<UserListProps> = ({
  list,
  navItemTitle,
  firstBtnName,
  firstBtnOnClick,
  mainBtnName,
  mainBtnOnClick
}) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  setTimeout(() => {
    setIsLoaded(true)
  }, 500)

  return (
    <div className='mb-16'>
      <p className='mb-4 text-2xl font-bold'>{navItemTitle}</p>
      <div className='flex flex-col gap-4'>
        {list &&
          list.map((user, index) => (
            <div key={index} className='flex items-center justify-between'>
              <Link to={`/member/${user.userID}`} className='flex items-center gap-4'>
                <Skeleton isLoaded={isLoaded} className='rounded-full'>
                  <img
                    className='h-16 w-16 rounded-full object-cover'
                    src={user.userIconUrl}
                    alt='User Icon'
                  />
                </Skeleton>
                <p className='text-xl'>{user.username}</p>
              </Link>
              <div className='flex gap-4'>
                {firstBtnName && (
                  <button
                    className='button-shadow h-10 w-20 rounded-xl bg-zinc-100 hover:bg-green-200'
                    onClick={() => firstBtnOnClick?.(user.userID)}
                  >
                    {firstBtnName}
                  </button>
                )}
                <button
                  className='button-shadow h-10 w-20 rounded-xl bg-zinc-100 hover:bg-red-200'
                  onClick={() => mainBtnOnClick(user.userID)}
                >
                  {mainBtnName}
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
