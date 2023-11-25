import { getDownloadURL, ref } from 'firebase/storage'
import { useEffect, useState } from 'react'
import { storage } from '../../auth/CloudStorage'
import Map from '../Map'
import ProfileIcon from './User-icon.png'
import BookmarkIcon from './bookmark.png'
import ClickedArrow from './clicked-arrow.png'
import HideArrow from './hide_arrow.png'
import SearchIcon from './search-icon.png'
import ShareIcon from './share-icon.png'
import ShowArrow from './show_arrow.png'
import SmallMap from './small-map.png'
import UnclickedArrow from './unclicked-arrow.png'

// const gpxFilePath = 'src/components/RouteView/Rusutsu.gpx'

interface Geopoint {
  latitude: number
  longitude: number
}

interface Spot {
  spot_title: string
  description: string | null
  spot_coordinate: Geopoint
  images: string[] | null
  videos: string[] | null
}

interface VisibilityState {
  [spot_title: string]: boolean
}

const Route = () => {
  const [gpxURL, setGpxURL] = useState<string>('')

  useEffect(() => {
    // const storageRef = ref(storage)
    // const gpxsRef = ref(storage, 'gpxs')
    const getGpx = async () => {
      try {
        const url = await getDownloadURL(ref(storage, 'Rusutsu.gpx'))
        console.log(typeof url, ':', url)
        setGpxURL(url)
        // const xhr = new XMLHttpRequest()
        // xhr.responseType = 'blob'
        // xhr.onload = (event) => {
        //   const blob = xhr.response
        // }
        // xhr.open('GET', url)
        // xhr.send()
      } catch (error) {
        console.log('Failed to get cloud storage gpx: ', error)
      }
    }

    getGpx()
  }, [])

  const initialSpots: Spot[] = [
    {
      spot_title: 'Spot 1',
      description: 'This is spot 1',
      spot_coordinate: { latitude: 40.7128, longitude: -74.006 },
      images: ['small-map.png'],
      videos: []
    },
    {
      spot_title: 'Spot 2',
      description: 'This is spot 2',
      spot_coordinate: { latitude: 40.7128, longitude: -74.006 },
      images: [],
      videos: [
        'https://youtube.com/shorts/8HBKH2DTmGw?feature=shared',
        'https://youtu.be/38gk0XYwq6s?feature=shared'
      ]
    },
    {
      spot_title: 'Spot 3',
      description: 'This is spot 3',
      spot_coordinate: { latitude: 40.7128, longitude: -74.006 },
      images: ['User-icon.png', 'User-icon.png'],
      videos: []
    }
  ]

  const [spotsVisibility, setSpotsVisibility] = useState<VisibilityState>(
    initialSpots.reduce((acc, spot) => ({ ...acc, [spot.spot_title]: false }), {})
  )

  const toggleVisibility = (spotTitle: string) => {
    setSpotsVisibility((prevVisibility) => ({
      ...prevVisibility,
      [spotTitle]: !prevVisibility[spotTitle]
    }))
  }

  return (
    <div className='flex h-screen pb-16'>
      <div className='flex w-1/3 flex-col bg-zinc-200 p-2'>
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
                  <p className='w-fit pr-2'>{spot.spot_title}</p>
                  {spotsVisibility[spot.spot_title] ? (
                    <img
                      className='h-auto w-6 cursor-pointer'
                      src={HideArrow}
                      alt='To Hide Arrow'
                      onClick={() => toggleVisibility(spot.spot_title)}
                    />
                  ) : (
                    <img
                      className='h-auto w-6 cursor-pointer'
                      src={ShowArrow}
                      alt='To Show Arrow'
                      onClick={() => toggleVisibility(spot.spot_title)}
                    />
                  )}
                </div>
                {spotsVisibility[spot.spot_title] && (
                  <div>
                    {spot.description && <p>{spot.description}</p>}
                    {spot.images && (
                      <div>
                        {spot.images.map((image, imageIndex) => (
                          <img key={imageIndex} src={`./${image}`} alt={`Image ${imageIndex}`} />
                        ))}
                      </div>
                    )}
                    {spot.videos && (
                      <div>
                        {spot.videos.map((video, videoIndex) => (
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

      <div className='flex w-2/3 flex-col bg-zinc-100'>{gpxURL && <Map gpxUrl={gpxURL} />}</div>
    </div>
  )
}

export default Route
