import { DocumentData, collection, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../../auth/CloudStorage'

const SearchResult = () => {
  const [allRoutes, setAllRoutes] = useState<DocumentData[]>([])
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
    <div>
      <p>SearchResult</p>
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
  )
}

export default SearchResult
