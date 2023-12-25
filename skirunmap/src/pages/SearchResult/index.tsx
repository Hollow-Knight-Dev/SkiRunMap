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
import { useParams } from 'react-router-dom'
import { db } from '../../auth/Firebase'
import HeroHeader from '../../components/HeroHeader'
import RouteCard from '../../components/RouteCard'
import FilterSVG from '../../images/FilterSVG'
import { useRouteCardStore } from '../../store/useRouteCard'
import { RouteKeywords } from '../../store/useSearch'

const SearchResult = () => {
  const { keyword } = useParams()
  const [resultRoutes, setResultRoutes] = useState<DocumentData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { setSelectedImages } = useRouteCardStore()

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

  return (
    <div className='h-screen-64px flex w-full flex-col items-center'>
      <HeroHeader />
      <div className='mt-4 flex w-[880px] flex-col items-center p-8'>
        <div className='mb-4 flex w-full flex-wrap items-center gap-2'>
          <div className='flex flex-wrap gap-2'>
            <p className='text-3xl font-bold'>
              Search Result: {keyword} ({resultRoutes.length})
            </p>
            <div className='flex items-center gap-2' onClick={handleFilterClick}>
              {/* <p className='text-xl font-bold'>filter</p> */}
              <FilterSVG />
            </div>
            {hasFilter && (
              <div className='flex w-full items-center justify-evenly rounded-xl bg-white pb-2 pt-2 font-semibold shadow-[0px_1px_8px_-4px_#7e7e7e]'>
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

        <div className='flex w-full flex-col flex-wrap gap-4'>
          {isLoading ? (
            <p>Loading...</p>
          ) : resultRoutes.length > 0 ? (
            <RouteCard data={resultRoutes} />
          ) : (
            <p>No related result</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchResult
