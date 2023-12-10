import { DocumentData, collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../../auth/CloudStorage'
import SearchBar from '../../components/SearchBar'

const Home = () => {
  const [allRoutes, setAllRoutes] = useState<DocumentData[]>([])
  const [hasFilter, setHasFilter] = useState(false)

  const handleFilterClick = () => {
    setHasFilter(true)
  }

  const handleFilterMouseLeave = () => {
    setHasFilter(false)
  }

  useEffect(() => {
    const q = query(
      collection(db, 'routes'),
      where('isSubmitted', '==', true),
      where('isPublic', '==', true),
      orderBy('createTime', 'desc')
    )
    // const unsubscribe =
    onSnapshot(q, (querySnapshot) => {
      const routes: DocumentData[] = []
      // console.log('Snapshot received!')
      querySnapshot.forEach((doc) => {
        routes.push(doc.data())
      })
      setAllRoutes(routes)
    })

    // return () => unsubscribe()
  }, [])

  return (
    <div className='flex w-full flex-col items-center'>
      <div className='home-bg-image flex h-[600px] w-full justify-center'>
        <div className='mt-36 flex h-max w-max flex-col items-center'>
          <p className='mb-2 w-max text-3xl font-bold'>Find routes</p>
          <SearchBar />
        </div>
      </div>
      <div className='flex w-full flex-col items-center p-8'>
        <div className='mb-2 flex w-full justify-between'>
          <p className='text-3xl font-bold'>Hottest routes</p>
          <div
            className='relative flex items-center gap-2'
            onClick={handleFilterClick}
            onMouseLeave={handleFilterMouseLeave}
          >
            <p className='text-xl font-bold'>filter</p>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              className='h-full w-6 cursor-pointer text-gray-600'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 6h16M6 12h12M8 18h8'
              />
            </svg>
            {hasFilter && (
              <div className='absolute right-0 top-8 flex w-20 flex-col items-center rounded-md bg-white pb-2 pt-2 font-semibold shadow-lg'>
                <button className='w-full cursor-pointer hover:bg-zinc-100'>All</button>
                <button className='w-full cursor-pointer hover:bg-zinc-100'>Hottest</button>
                <button className='w-full cursor-pointer hover:bg-zinc-100'>Newest</button>
              </div>
            )}
          </div>
        </div>
        <div className='mb-6 w-full border border-zinc-300' />
        <div className='flex w-fit flex-wrap gap-4'>
          {allRoutes.map((map, index) => (
            <Link
              key={index}
              to={`/route/${map.routeID}`}
              className='h-48 w-48 cursor-pointer rounded-2xl bg-zinc-300 p-4'
            >
              <p>Title: {map.routeTitle}</p>
              <p>User: {map.username}</p>
              <p>Tag: {map.tags}</p>
              <p>Snow Buddy: {map.snowBuddies}</p>
              <div className='flex gap-1'>
                {map.spots[0].imageUrls.map((url: string, index: number) => (
                  <img key={index} src={url} alt={`Image ${index}`} className='h-auto w-6' />
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
