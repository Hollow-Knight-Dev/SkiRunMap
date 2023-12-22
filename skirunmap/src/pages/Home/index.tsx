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
import { db } from '../../auth/Firebase'
import FilterSVG from '../../components/FilterSVG'
import HeroHeader from '../../components/HeroHeader'
import RouteCard from '../../components/RouteCard'
import { useRouteCardStore } from '../../store/useRouteCard'
import { useUserStore } from '../../store/useUser'

const Home = () => {
  const [allRoutes, setAllRoutes] = useState<DocumentData[]>([])
  const [hasFilter, setHasFilter] = useState(false)
  const [filter, setFilter] = useState<string>('All')
  const { setSelectedImages, setLikeRouteCards, setDislikeRouteCards } = useRouteCardStore()
  const { userDoc } = useUserStore()

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
    // console.log(filter)
    const filterOptions: Record<string, QueryOrderByConstraint | null> = {
      Newest: orderBy('createTime', 'desc'),
      'Most Likes': orderBy('likeCount', 'desc'),
      'Most Views': orderBy('viewCount', 'desc')
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

  useEffect(() => {
    const initialSelectedImages: { [routeID: string]: number } = {}
    allRoutes.forEach((route) => {
      initialSelectedImages[route.routeID] = 0
    })
    setSelectedImages(initialSelectedImages)
  }, [allRoutes])

  useEffect(() => {
    const initialLikeRouteCard: { [routeID: string]: boolean } = {}
    const initialDislikeRouteCard: { [routeID: string]: boolean } = {}

    if (userDoc?.userID && allRoutes.length > 0) {
      allRoutes.forEach((route) => {
        if (route.likeUsers.includes(userDoc.userID)) {
          initialLikeRouteCard[route.routeID] = true
        } else {
          initialLikeRouteCard[route.routeID] = false
        }

        if (route.dislikeUsers.includes(userDoc.userID)) {
          initialDislikeRouteCard[route.routeID] = true
        } else {
          initialDislikeRouteCard[route.routeID] = false
        }
      })
      setLikeRouteCards(initialLikeRouteCard)
      setDislikeRouteCards(initialDislikeRouteCard)
    }
  }, [allRoutes, userDoc])

  return (
    <div className='h-screen-64px flex w-full flex-col items-center'>
      <HeroHeader />
      <div className='mt-4 flex w-4/5 flex-col items-center p-8'>
        <div className='mb-4 flex w-[880px] flex-wrap items-center gap-2'>
          <p className='text-3xl font-bold'>{filter} Routes</p>
          <div className='flex items-center gap-2' onClick={handleFilterIconClick}>
            {/* <p className='text-xl font-bold'>filter</p> */}
            <FilterSVG />
          </div>
          {hasFilter && (
            <div className='flex w-full items-center justify-evenly rounded-xl bg-white pb-2 pt-2 font-semibold shadow-[0px_1px_8px_-4px_#7e7e7e]'>
              <button
                className={`w-fit rounded-xl pl-16 pr-16 ${filter === 'Newest' && 'bg-blue-200'}`}
                onClick={() => handleFilterClick('Newest')}
              >
                Newest
              </button>
              <button
                className={`w-fit rounded-xl pl-16 pr-16 ${
                  filter === 'Most Likes' && 'bg-blue-200'
                }`}
                onClick={() => handleFilterClick('Most Likes')}
              >
                Most Likes
              </button>
              <button
                className={`w-fit rounded-xl pl-16 pr-16 ${
                  filter === 'Most Views' && 'bg-blue-200'
                }`}
                onClick={() => handleFilterClick('Most Views')}
              >
                Most Views
              </button>
            </div>
          )}
        </div>
        <div className='flex h-fit w-full justify-center'>
          <RouteCard data={allRoutes} />
        </div>
      </div>
    </div>
  )
}

export default Home
