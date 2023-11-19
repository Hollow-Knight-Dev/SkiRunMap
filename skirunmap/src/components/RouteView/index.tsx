import { useState } from 'react'
import ProfileIcon from './User-icon.png'
import BookmarkIcon from './bookmark.png'
import ClickedArrow from './clicked-arrow.png'
import HideArrow from './hide_arrow.png'
import SearchIcon from './search-icon.png'
import ShareIcon from './share-icon.png'
import ShowArrow from './show_arrow.png'
import SmallMap from './small-map.png'
import UnclickedArrow from './unclicked-arrow.png'

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
  const initialSpots: Spot[] = [
    {
      spot_title: 'Spot 1',
      description: 'This is spot 1',
      spot_coordinate: { latitude: 40.7128, longitude: -74.006 },
      images: ['small-map.png'],
      videos: [],
    },
    {
      spot_title: 'Spot 2',
      description: 'This is spot 2',
      spot_coordinate: { latitude: 40.7128, longitude: -74.006 },
      images: [],
      videos: [
        'https://youtube.com/shorts/8HBKH2DTmGw?feature=shared',
        'https://youtu.be/38gk0XYwq6s?feature=shared',
      ],
    },
    {
      spot_title: 'Spot 3',
      description: 'This is spot 3',
      spot_coordinate: { latitude: 40.7128, longitude: -74.006 },
      images: ['User-icon.png', 'User-icon.png'],
      videos: [],
    },
  ]

  const [spotsVisibility, setSpotsVisibility] = useState<VisibilityState>(
    initialSpots.reduce(
      (acc, spot) => ({ ...acc, [spot.spot_title]: false }),
      {},
    ),
  )

  const toggleVisibility = (spotTitle: string) => {
    setSpotsVisibility((prevVisibility) => ({
      ...prevVisibility,
      [spotTitle]: !prevVisibility[spotTitle],
    }))
  }

  return (
    <div className='flex'>
      <div className='w-1/3 h-screen bg-zinc-200 flex flex-col p-2'>
        <div className='w-full relative mb-2'>
          <input
            className='w-full p-1 pl-10 border border-zinc-300 rounded-3xl'
            placeholder='Ski resort, ski run, or tag name'
          />
          <img
            className='absolute w-5 top-2 left-3'
            src={SearchIcon}
            alt='Search Icon'
          />
        </div>

        <div className='relative pb-8'>
          <img className='w-full h-auto' src={SmallMap} alt='Small Map' />
          <div className='absolute bottom-3 end-12 w-10 h-10 rounded-full bg-white flex justify-center items-center'>
            <img
              className='w-3/5 h-auto'
              src={BookmarkIcon}
              alt='Bookmark Icon'
            />
          </div>
          <div className='absolute bottom-3 end-0 w-10 h-10 rounded-full bg-white flex justify-center items-center'>
            <img className='w-3/5 h-auto' src={ShareIcon} alt='Share Icon' />
          </div>
        </div>

        <div className='flex flex-col gap-4 p-2'>
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <img
                className='w-4 h-auto'
                src={ClickedArrow}
                alt='Clicked Arrow'
              />
              <p>50</p>
              <img
                className='w-4 h-auto'
                src={UnclickedArrow}
                alt='Unclicked Arrow'
              />
            </div>
            <p className='font-bold text-2xl'>Route title</p>
          </div>

          <div className='flex items-center'>
            <img
              className='w-10 h-10'
              src={ProfileIcon}
              alt='Friend Profile Icon'
            />
            <p className='w-fit pl-4'>I Am Not Groot · Nov 15, 2023</p>
          </div>

          <div>
            {initialSpots.map((spot, index) => (
              <div key={index} className='flex flex-col'>
                <div className='flex'>
                  <p className='w-fit pr-2'>{spot.spot_title}</p>
                  {spotsVisibility[spot.spot_title] ? (
                    <img
                      className='w-6 h-auto cursor-pointer'
                      src={HideArrow}
                      alt='To Hide Arrow'
                      onClick={() => toggleVisibility(spot.spot_title)}
                    />
                  ) : (
                    <img
                      className='w-6 h-auto cursor-pointer'
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
                          <img
                            key={imageIndex}
                            src={`./${image}`}
                            alt={`Image ${imageIndex}`}
                          />
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
          <p className='font-bold text-lg'>Comment</p>
          <textarea className='w-full h-20' />
        </div>
      </div>

      <div className='w-2/3 h-screen bg-zinc-100 flex flex-col'>
        <p>Google Map api</p>
      </div>
    </div>
  )
}

export default Route
