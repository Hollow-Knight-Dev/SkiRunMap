import {
  DocumentData,
  QueryOrderByConstraint,
  collection,
  getDocs,
  orderBy,
  query,
  where
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../../auth/CloudStorage'
import Filter from '../../components/Filter'
import HeroHeader from '../../components/HeroHeader'

const Home = () => {
  const [allRoutes, setAllRoutes] = useState<DocumentData[]>([])
  const [hasFilter, setHasFilter] = useState(false)
  const [filter, setFilter] = useState<string>('All')

  const handleFilterIconClick = () => {
    setHasFilter((prev) => !prev)
  }

  const handleFilterClick = (newFilter: string) => {
    if (filter === newFilter) {
      setFilter('')
    } else {
      setFilter(newFilter)
    }
  }

  useEffect(() => {
    console.log(filter)
    const filterOptions: Record<string, QueryOrderByConstraint | null> = {
      Newest: orderBy('createTime', 'desc'),
      'Most likes': orderBy('likeCount', 'desc'),
      'Most views': orderBy('viewCount', 'desc')
    }

    const getRoutes = async () => {
      let q = query(
        collection(db, 'routes'),
        where('isSubmitted', '==', true),
        where('isPublic', '==', true)
      )

      if (filter) {
        const order = filterOptions[filter]
        if (order) {
          q = query(q, order)
        }
      }

      if (q) {
        const querySnapshot = await getDocs(q)
        const routeDocData: DocumentData[] = []
        querySnapshot.forEach((doc) => {
          routeDocData.push(doc.data())
        })
        setAllRoutes(routeDocData)
      }
    }

    getRoutes()
  }, [filter])

  return (
    <div className='flex w-full flex-col items-center'>
      <HeroHeader />
      <div className='flex w-full flex-col items-center p-8'>
        <div className='mb-4 flex w-full flex-wrap justify-between'>
          <p className='text-3xl font-bold'>{filter} Routes</p>
          <div className='flex items-center gap-2' onClick={handleFilterIconClick}>
            <p className='text-xl font-bold'>filter</p>
            <Filter />
          </div>
          {hasFilter && (
            <div className='flex w-full items-center gap-4 rounded-md bg-white pb-2 pt-2 font-semibold shadow-lg'>
              <button
                className={`w-full rounded-xl ${filter === 'Newest' && 'bg-blue-200'}`}
                onClick={() => handleFilterClick('Newest')}
              >
                Newest
              </button>
              <button
                className={`w-full rounded-xl ${filter === 'Most likes' && 'bg-blue-200'}`}
                onClick={() => handleFilterClick('Most likes')}
              >
                Most Likes
              </button>
              <button
                className={`w-full rounded-xl ${filter === 'Most views' && 'bg-blue-200'}`}
                onClick={() => handleFilterClick('Most views')}
              >
                Most Views
              </button>
            </div>
          )}
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
              <p>LikeCount: {map.likeCount}</p>
              <p>viewCount: {map.viewCount}</p>
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
