import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { useRouteTitle } from '../../store/useRoute'

const temp = uuidv4()

const RouteCreate: React.FC = () => {
  const routeTitle = useRouteTitle((state) => state.routeTitle)
  const setRouteTitle = useRouteTitle((state) => state.setRouteTitle)

  useEffect(() => {
    console.log(routeTitle)
  }, [routeTitle])

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value
    if (title.length <= 30) {
      setRouteTitle(title)
    } else {
      alert('Exceed letter limitation')
      setRouteTitle(title.slice(0, 30))
    }
  }

  const handleCreateRoute = () => {
    if (routeTitle) {
      alert(`Route created: ${routeTitle}!`)
    } else {
      alert("You have'nt typed route title!")
    }
  }

  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <div className='flex h-64 w-64 flex-col items-center rounded-md bg-zinc-300 p-8'>
        <p className='mb-1'>Enter route title:</p>
        <input
          type='text'
          value={routeTitle}
          onChange={(event) => {
            handleInput(event)
          }}
          className='w-full'
        />
        <div className='mt-auto flex w-full justify-evenly'>
          <button className='rounded-md bg-zinc-400 p-1' onClick={() => handleCreateRoute()}>
            Confirm
          </button>
          <Link to='/' className='rounded-md bg-zinc-400 p-1'>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RouteCreate
