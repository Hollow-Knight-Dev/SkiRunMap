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
import { Link, useParams } from 'react-router-dom'
import { db } from '../../auth/CloudStorage'
import FilterSVG from '../../components/FilterSVG'
import HeroHeader from '../../components/HeroHeader'
import { Spot } from '../../store/useRoute'
import { RouteKeywords } from '../../store/useSearch'

const SearchResult = () => {
  const { keyword } = useParams()
  const [resultRoutes, setResultRoutes] = useState<DocumentData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedImages, setSelectedImages] = useState<{ [routeID: string]: number }>({})

  const [hasFilter, setHasFilter] = useState(false)
  const [filter, setFilter] = useState<string[]>([])

  useEffect(() => {
    console.log('Filter:', filter)
  }, [filter])

  const handleFilterClick = () => {
    setHasFilter((prev) => !prev)
  }

  const handleAddFilter = (newFilter: string) => {
    if (filter.includes(newFilter)) {
      const updateFilter = filter.filter((filter) => filter !== newFilter)
      setFilter(updateFilter)
    } else {
      setFilter([...filter, newFilter])
    }
  }

  useEffect(() => {
    const filterOptions: Record<string, QueryOrderByConstraint | null> = {
      Newest: orderBy('createTime', 'desc'),
      'Most likes': orderBy('likeCount', 'desc'),
      'Most views': orderBy('viewCount', 'desc')
    }

    const getRoutes = async (keywords: string[], filters: string[]) => {
      try {
        const routeIDs: string[] = []
        const querySnapshot = await getDocs(
          query(collection(db, 'keywords'), where('keywords', 'array-contains-any', keywords))
        )
        querySnapshot.forEach((doc) => {
          routeIDs.push(doc.data().routeID)
        })

        let q = query(
          collection(db, 'routes'),
          where('isSubmitted', '==', true),
          where('isPublic', '==', true),
          where('routeID', 'in', routeIDs)
        )

        for (const filter of filters) {
          const order = filterOptions[filter]
          if (order) {
            q = query(q, order)
          }
        }

        const routesSnapshot = await getDocs(q)
        const data = routesSnapshot.docs.map((doc) => doc.data())
        setResultRoutes(data)
      } catch (error) {
        console.error('Error fetching routes:', error)
      }
    }

    const handleSearch = async () => {
      setIsLoading(true)
      try {
        if (keyword) {
          const querySnapshot = await getDocs(collection(db, 'keywords'))
          const results: string[] = []

          querySnapshot.forEach((doc) => {
            const docData = doc.data() as RouteKeywords
            const keywords = docData.keywords
            keywords.forEach((kw) => {
              if (kw.toLowerCase().includes(keyword.toLowerCase())) {
                if (!results.includes(kw)) {
                  results.push(kw)
                }
              }
            })
          })

          if (results.length > 0) {
            getRoutes(results, filter)
          } else {
            setResultRoutes([])
          }
        }
      } catch (error) {
        console.error('Error during search:', error)
      } finally {
        setIsLoading(false)
      }
    }
    handleSearch()
  }, [keyword, filter])

  useEffect(() => {
    const initialSelectedImages: { [routeID: string]: number } = {}
    resultRoutes.forEach((route) => {
      initialSelectedImages[route.routeID] = 0
    })
    setSelectedImages(initialSelectedImages)
  }, [resultRoutes])

  const handleDotClick = (routeID: string, index: number) => {
    setSelectedImages((prev) => ({ ...prev, [routeID]: index }))
  }

  return (
    <div className='flex w-full flex-col items-center'>
      <HeroHeader />
      <div className='flex w-4/5 flex-col items-center p-8'>
        <div className='mb-4 flex w-full flex-col items-center'>
          <div className='flex w-full flex-wrap justify-between'>
            <p className='text-3xl font-bold'>
              Search Result: {keyword} ({resultRoutes.length})
            </p>
            <div className='mb-4 flex items-center gap-2' onClick={handleFilterClick}>
              <p className='text-xl font-bold'>filter</p>
              <FilterSVG />
            </div>
            {hasFilter && (
              <div className='flex w-full items-center  justify-evenly rounded-xl bg-white pb-2 pt-2 font-semibold shadow-[0px_1px_8px_-4px_#7e7e7e]'>
                <button
                  className={`w-fit rounded-xl pl-16 pr-16 ${
                    filter.includes('Newest') && 'bg-blue-200'
                  }`}
                  onClick={() => handleAddFilter('Newest')}
                >
                  Newest
                </button>
                <button
                  className={`w-fit rounded-xl pl-16 pr-16 ${
                    filter.includes('Most likes') && 'bg-blue-200'
                  }`}
                  onClick={() => handleAddFilter('Most likes')}
                >
                  Most likes
                </button>
                <button
                  className={`w-fit rounded-xl pl-16 pr-16 ${
                    filter.includes('Most views') && 'bg-blue-200'
                  }`}
                  onClick={() => handleAddFilter('Most views')}
                >
                  Most views
                </button>
              </div>
            )}
          </div>
        </div>
        <div className='mb-6 w-full border border-zinc-300' />

        <div className='h-screen-64px flex w-full flex-col flex-wrap gap-4'>
          {isLoading ? (
            <p>Loading...</p>
          ) : resultRoutes.length > 0 ? (
            resultRoutes.map((route, index) => {
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
                              selectedImages[route.routeID] === spanIndex
                                ? 'bg-blue-500'
                                : 'bg-white'
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
            })
          ) : (
            <p>No related result</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchResult
