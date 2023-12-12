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
import { Link, useLocation, useParams } from 'react-router-dom'
import { db } from '../../auth/CloudStorage'
import Filter from '../../components/Filter'
import HeroHeader from '../../components/HeroHeader'
import { RouteKeywords } from '../../store/useSearch'

const SearchResult = () => {
  const { keyword } = useParams()
  const location = useLocation()
  const suggestedKeywords = location.state?.suggestedKeywords || null
  const [resultRoutes, setResultRoutes] = useState<DocumentData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

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
        if (suggestedKeywords !== null) {
          if (suggestedKeywords.length > 0) {
            getRoutes(suggestedKeywords, filter)
          } else {
            setResultRoutes([])
          }
        } else if (suggestedKeywords === null && keyword) {
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
  }, [suggestedKeywords, filter])

  return (
    <div>
      <HeroHeader />
      <div className='p-8'>
        <div className='mb-4 flex w-full flex-col items-center'>
          <div className='flex w-full flex-wrap justify-between'>
            <p className='text-3xl font-bold'>
              Search Result: {keyword} ({resultRoutes.length})
            </p>
            <div className='flex items-center gap-2' onClick={handleFilterClick}>
              <p className='text-xl font-bold'>filter</p>
              <Filter />
            </div>
            {hasFilter && (
              <div className='flex w-full items-center gap-4 rounded-md bg-white pb-2 pt-2 font-semibold shadow-lg'>
                <button
                  className={`w-full rounded-xl ${filter.includes('Newest') && 'bg-blue-200'}`}
                  onClick={() => handleAddFilter('Newest')}
                >
                  Newest
                </button>
                <button
                  className={`w-full rounded-xl ${filter.includes('Most likes') && 'bg-blue-200'}`}
                  onClick={() => handleAddFilter('Most likes')}
                >
                  Most likes
                </button>
                <button
                  className={`w-full rounded-xl ${filter.includes('Most views') && 'bg-blue-200'}`}
                  onClick={() => handleAddFilter('Most views')}
                >
                  Most views
                </button>
              </div>
            )}
          </div>
        </div>
        <div className='mb-6 w-full border border-zinc-300' />

        <div className='flex w-fit flex-wrap gap-4'>
          {isLoading ? (
            <p>Loading...</p>
          ) : resultRoutes.length > 0 ? (
            resultRoutes.map((map) => (
              <Link
                key={map.routeID}
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
            ))
          ) : (
            <p>No related result</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchResult
