import { DocumentData, collection, getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { db } from '../../auth/CloudStorage'
import SearchBar from '../../components/SearchBar'
import { RouteKeywords } from '../../store/useSearch'

const SearchResult = () => {
  const { keyword } = useParams()
  const location = useLocation()
  const suggestedKeywords = location.state?.suggestedKeywords || null
  const [resultRoutes, setResultRoutes] = useState<DocumentData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [hasFilter, setHasFilter] = useState(false)

  const handleFilterClick = () => {
    setHasFilter(true)
  }

  const handleFilterMouseLeave = () => {
    setHasFilter(false)
  }

  useEffect(() => {
    const getRoutes = async (keywords: string[]) => {
      try {
        const routeIDs: string[] = []
        const querySnapshot = await getDocs(
          query(collection(db, 'keywords'), where('keywords', 'array-contains-any', keywords))
        )
        querySnapshot.forEach((doc) => {
          routeIDs.push(doc.data().routeID)
        })

        const routesSnapshot = await getDocs(
          query(
            collection(db, 'routes'),
            where('isSubmitted', '==', true),
            where('isPublic', '==', true),
            where('routeID', 'in', routeIDs)
          )
        )
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
            getRoutes(suggestedKeywords)
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
            getRoutes(results)
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
  }, [suggestedKeywords])

  return (
    <div>
      <div className='home-bg-image flex h-[600px] w-full justify-center'>
        <div className='mt-36 flex h-max w-max flex-col items-center'>
          <p className='mb-2 w-max text-3xl font-bold'>Find routes</p>
          <SearchBar />
        </div>
      </div>

      <div className='p-8'>
        <div className='mb-4 flex w-full flex-col items-center'>
          <div className='flex w-full justify-between'>
            <p className='text-3xl font-bold'>
              Search Result: {keyword} ({resultRoutes.length})
            </p>
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
