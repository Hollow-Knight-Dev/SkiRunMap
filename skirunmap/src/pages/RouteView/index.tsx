import { doc, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../../auth/CloudStorage'
import Map from '../../components/Map'
import { Route, Spot } from '../../store/useRoute'
import ProfileIcon from './User-icon.png'
import BookmarkIcon from './bookmark.png'
import ClickedArrow from './clicked-arrow.png'
import HideArrow from './hide_arrow.png'
import SearchIcon from './search-icon.png'
import ShareIcon from './share-icon.png'
import ShowArrow from './show_arrow.png'
import SmallMap from './small-map.png'
import UnclickedArrow from './unclicked-arrow.png'

interface VisibilityState {
  [spotTitle: string]: boolean
}

const RouteView = () => {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<Route>()

  useEffect(() => {
    if (id) {
      onSnapshot(doc(db, 'routes', id), (doc) => {
        const routeData = doc.data()
        if (routeData) {
          console.log(routeData)
          setData(routeData as Route)
        } else {
          console.error('Fail to get route data from Firestore')
        }
      })
    }
  }, [])

  const initialSpots: Spot[] = [
    {
      spotTitle: 'Spot 1',
      spotDescription: 'This is spot 1',
      spotCoordinate: { lat: 40.7128, lng: -74.006 },
      imageUrls: ['small-map.png'],
      videoUrls: []
    },
    {
      spotTitle: 'Spot 2',
      spotDescription: 'This is spot 2',
      spotCoordinate: { lat: 40.7128, lng: -74.006 },
      imageUrls: [],
      videoUrls: [
        'https://youtube.com/shorts/8HBKH2DTmGw?feature=shared',
        'https://youtu.be/38gk0XYwq6s?feature=shared'
      ]
    },
    {
      spotTitle: 'Spot 3',
      spotDescription: 'This is spot 3',
      spotCoordinate: { lat: 40.7128, lng: -74.006 },
      imageUrls: ['User-icon.png', 'User-icon.png'],
      videoUrls: []
    }
  ]

  const [spotsVisibility, setSpotsVisibility] = useState<VisibilityState>(
    initialSpots.reduce((acc, spot) => ({ ...acc, [spot.spotTitle]: false }), {})
  )

  const toggleVisibility = (spotTitle: string) => {
    setSpotsVisibility((prevVisibility) => ({
      ...prevVisibility,
      [spotTitle]: !prevVisibility[spotTitle]
    }))
  }

  return (
    <div className='h-screen-64px flex'>
      <div className='flex w-2/3 flex-col bg-zinc-100'>
        {data?.gpxUrl && <Map gpxUrl={data?.gpxUrl} />}
      </div>

      <div className='flex w-1/3 flex-col overflow-y-auto overflow-x-hidden bg-zinc-200 p-2'>
        <div className='relative mb-2 w-full'>
          <input
            className='w-full rounded-3xl border border-zinc-300 p-1 pl-10'
            placeholder='Ski resort, ski run, or tag name'
          />
          <img className='absolute left-3 top-2 w-5' src={SearchIcon} alt='Search Icon' />
        </div>

        <div className='relative pb-8'>
          <img className='h-auto w-full' src={SmallMap} alt='Small Map' />
          <div className='absolute bottom-3 end-12 flex h-10 w-10 items-center justify-center rounded-full bg-white'>
            <img className='h-auto w-3/5' src={BookmarkIcon} alt='Bookmark Icon' />
          </div>
          <div className='absolute bottom-3 end-0 flex h-10 w-10 items-center justify-center rounded-full bg-white'>
            <img className='h-auto w-3/5' src={ShareIcon} alt='Share Icon' />
          </div>
        </div>

        <div className='flex flex-col gap-4 p-2'>
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <img className='h-auto w-4' src={ClickedArrow} alt='Clicked Arrow' />
              <p>50</p>
              <img className='h-auto w-4' src={UnclickedArrow} alt='Unclicked Arrow' />
            </div>
            <p className='text-2xl font-bold'>Route title</p>
          </div>

          <div className='flex items-center'>
            <img className='h-10 w-10' src={ProfileIcon} alt='Friend Profile Icon' />
            <p className='w-fit pl-4'>I Am Not Groot · Nov 15, 2023</p>
          </div>

          <div>
            {initialSpots.map((spot, index) => (
              <div key={index} className='flex flex-col'>
                <div className='flex'>
                  <p className='w-fit pr-2'>{spot.spotTitle}</p>
                  {spotsVisibility[spot.spotTitle] ? (
                    <img
                      className='h-auto w-6 cursor-pointer'
                      src={HideArrow}
                      alt='To Hide Arrow'
                      onClick={() => toggleVisibility(spot.spotTitle)}
                    />
                  ) : (
                    <img
                      className='h-auto w-6 cursor-pointer'
                      src={ShowArrow}
                      alt='To Show Arrow'
                      onClick={() => toggleVisibility(spot.spotTitle)}
                    />
                  )}
                </div>
                {spotsVisibility[spot.spotTitle] && (
                  <div>
                    {spot.spotDescription && <p>{spot.spotDescription}</p>}
                    {spot.imageUrls && (
                      <div>
                        {spot.imageUrls.map((image, imageIndex) => (
                          <img key={imageIndex} src={`./${image}`} alt={`Image ${imageIndex}`} />
                        ))}
                      </div>
                    )}
                    {spot.videoUrls && (
                      <div>
                        {spot.videoUrls.map((video, videoIndex) => (
                          <video key={videoIndex} controls>
                            <source src={video} type='video' />
                            Your browser does not support the video tag.
                          </video>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className='w-full border border-zinc-300' />
          <p className='text-lg font-bold'>Comment</p>
          <textarea className='h-20 w-full' />
        </div>
      </div>
    </div>
  )
}

export default RouteView
