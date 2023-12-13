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
import FilterSVG from '../../components/FilterSVG'
import HeroHeader from '../../components/HeroHeader'
import { Spot } from '../../store/useRoute'

const Home = () => {
  const [allRoutes, setAllRoutes] = useState<DocumentData[]>([])
  const [hasFilter, setHasFilter] = useState(false)
  const [filter, setFilter] = useState<string>('All')
  const [selectedImages, setSelectedImages] = useState<{ [routeID: string]: number }>({})

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

  useEffect(() => {
    const initialSelectedImages: { [routeID: string]: number } = {}
    allRoutes.forEach((route) => {
      initialSelectedImages[route.routeID] = 0
    })
    setSelectedImages(initialSelectedImages)
  }, [allRoutes])

  // useEffect(() => {
  //   console.log('selectedImages:', selectedImages)
  // }, [selectedImages])

  const handleDotClick = (routeID: string, index: number) => {
    setSelectedImages((prev) => ({ ...prev, [routeID]: index }))
  }

  // const handleImageBug = (index: number) => {
  //   console.log(index)
  // }

  return (
    <div className='flex w-full flex-col items-center'>
      <HeroHeader />
      <div className='flex w-4/5 flex-col items-center p-8'>
        <div className='mb-4 flex w-full flex-wrap justify-between'>
          <p className='text-3xl font-bold'>{filter} Routes</p>
          <div className='mb-4 flex items-center gap-2' onClick={handleFilterIconClick}>
            <p className='text-xl font-bold'>filter</p>
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
                  filter === 'Most likes' && 'bg-blue-200'
                }`}
                onClick={() => handleFilterClick('Most Likes')}
              >
                Most Likes
              </button>
              <button
                className={`w-fit rounded-xl pl-16 pr-16 ${
                  filter === 'Most views' && 'bg-blue-200'
                }`}
                onClick={() => handleFilterClick('Most Views')}
              >
                Most Views
              </button>
            </div>
          )}
        </div>
        <div className='mb-6 w-full border border-zinc-300' />
        <div className='flex w-full flex-col flex-wrap gap-4'>
          {allRoutes.map((route, index) => {
            let imageIndex = 0
            return (
              <div
                key={index}
                className='relative h-60 w-full cursor-pointer rounded-2xl bg-blue-50 p-4 shadow-[3px_5px_7px_-6px_#7e7e7e] duration-300 hover:shadow-[10px_12px_10px_-12px_#7e7e7e]'
              >
                <Link
                  key={`${route.routeID}_${index}`}
                  to={`/route/${route.routeID}`}
                  className='absolute left-0 top-0 z-10 h-full w-full cursor-pointer rounded-2xl'
                />
                <div className='flex gap-8 text-xl'>
                  <div className='relative h-52 w-52 rounded-xl bg-zinc-200'>
                    <div className='flex h-full w-full'>
                      {route.spots?.map((spot: Spot) =>
                        spot.imageUrls.map((url: string) => (
                          <img
                            key={imageIndex++}
                            src={url}
                            alt={spot.spotTitle}
                            className={`aspect-square rounded-xl object-cover ${
                              selectedImages[route.routeID] === imageIndex ? 'block' : 'hidden'
                            }`}
                            // onClick={() => handleImageBug(imageIndex)}
                          />
                        ))
                      )}
                    </div>
                    <div className='absolute bottom-2 z-20 flex h-4 w-full flex-wrap items-center justify-center gap-2'>
                      {Array.from({
                        length: route.spots?.reduce(
                          (acc: number, spot: Spot) => acc + spot.imageUrls.length,
                          0
                        )
                      }).map((_, spanIndex) => (
                        <span
                          key={spanIndex}
                          className={`dot h-2 w-2 rounded-full  opacity-70 ${
                            selectedImages[route.routeID] === spanIndex ? 'bg-blue-500' : 'bg-white'
                          }`}
                          onClick={() => handleDotClick(route.routeID, spanIndex)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className='flex flex-col gap-6 p-2'>
                    <p className='text-2xl font-bold'>{route.routeTitle}</p>
                    <p>Likes: {route.likeCount}</p>
                    <div className='flex flex-wrap gap-2'>
                      <p>Tag: </p>
                      {route.tags.length > 0 ? (
                        route.tags.map((tag: string, index: number) => (
                          <Link
                            key={`${route.routeID}_tag_${index}`}
                            to={`/search/${tag}`}
                            className='rounded-xl bg-blue-100 pl-2 pr-2'
                          >
                            # {tag}
                          </Link>
                        ))
                      ) : (
                        <p>None</p>
                      )}
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      <p>Spots: </p>
                      {route.spots.length > 0 ? (
                        route.spots?.map((spot: Spot, index: number) => (
                          <Link
                            key={`${route.routeID}_spot_${index}`}
                            to={`/search/${spot.spotTitle}`}
                            className='rounded-xl bg-blue-100 pl-2 pr-2'
                          >
                            {spot.spotTitle}
                          </Link>
                        ))
                      ) : (
                        <p>None</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Home
