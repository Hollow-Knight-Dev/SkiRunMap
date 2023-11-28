import { doc, onSnapshot, Timestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../../auth/CloudStorage'
import Map from '../../components/Map'
import { Route, Spot } from '../../store/useRoute'
import BookmarkIcon from './bookmark.png'
import ClickedArrow from './clicked-arrow.png'
import SearchIcon from './search-icon.png'
import ShareIcon from './share-icon.png'
import SmallMap from './small-map.png'
import UnclickedArrow from './unclicked-arrow.png'
import ProfileIcon from './User-icon.png'

interface VisibilityState {
  [spotIndex: number]: boolean
}

const RouteView = () => {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<Route>()
  const [spotsVisibility, setSpotsVisibility] = useState<VisibilityState>({})

  const toggleVisibility = (spotIndex: number) => {
    setSpotsVisibility((prevVisibility) => ({
      ...prevVisibility,
      [spotIndex]: !prevVisibility[spotIndex]
    }))
  }

  const [commentVisibility, setCommentVisibility] = useState<boolean>(true)
  const toggleCommentVisibility = () => {
    setCommentVisibility((prev) => !prev)
  }
  const [formattedTime, setFormattedTime] = useState<string>('')

  const formatTimestamp = (timestamp: Timestamp) => {
    const milliseconds = timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6
    const date = new Date(milliseconds)
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour12: false,
      hour: 'numeric',
      minute: 'numeric'
    }
    const formattedDate = date.toLocaleString('en-UK', options).replace(',', ' at')
    setFormattedTime(formattedDate)
  }

  useEffect(() => {
    if (id) {
      onSnapshot(doc(db, 'routes', id), (doc) => {
        const routeData = doc.data()
        if (routeData) {
          console.log(routeData)
          setData(routeData as Route)
          const initialVisibility: VisibilityState = routeData.spots.reduce(
            (acc: VisibilityState, _: Spot, index: number) => ({ ...acc, [index]: true }),
            {}
          )
          setSpotsVisibility(initialVisibility)
          formatTimestamp(routeData?.createTime)
        } else {
          console.error('Fail to get route data from Firestore')
        }
      })
    }
  }, [])

  return (
    <div className='h-screen-64px flex'>
      {data ? (
        <>
          <div className='flex w-2/3 flex-col bg-zinc-100'>
            {data.gpxUrl && <Map gpxUrl={data.gpxUrl} />}
          </div>

          <div className='flex w-1/3 flex-col overflow-x-hidden overflow-y-scroll bg-zinc-200 p-2'>
            <div className='relative mb-2 w-full'>
              <input
                className='w-full rounded-3xl border border-zinc-300 p-1 pl-10'
                placeholder='Ski resort, ski run, or tag name'
              />
              <img className='absolute left-3 top-2 w-5' src={SearchIcon} alt='Search Icon' />
            </div>

            <div className='relative'>
              <img className='h-auto w-full' src={SmallMap} alt='Small Map' />
              <div className='absolute bottom-2 end-14 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-amber-100 bg-opacity-70 hover:bg-white hover:bg-opacity-100'>
                <img className='h-auto w-3/5' src={BookmarkIcon} alt='Bookmark Icon' />
              </div>
              <div className='absolute bottom-2 end-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-amber-100 bg-opacity-70 hover:bg-white hover:bg-opacity-100'>
                <img className='h-auto w-3/5' src={ShareIcon} alt='Share Icon' />
              </div>
            </div>

            <div className='flex flex-col gap-4 p-2'>
              <div className='ml-3 flex items-center gap-6'>
                <div className='flex flex-col items-center'>
                  <img className='h-auto w-4' src={ClickedArrow} alt='Clicked Arrow' />
                  <p>{data.likeCount}</p>
                  <img className='h-auto w-4' src={UnclickedArrow} alt='Unclicked Arrow' />
                </div>
                <p className='text-2xl font-bold'>{data.routeTitle}</p>
              </div>

              <div className='flex items-center'>
                <img className='h-10 w-10' src={ProfileIcon} alt='Friend Profile Icon' />
                <p className='w-fit pl-4'>
                  {data.username} · {formattedTime}
                </p>
              </div>

              <div className='flex flex-wrap'>
                <p className='w-full'>Route start coordinate:</p>
                <p className='w-full'>Latitude: {data.routeCoordinate.lat}</p>
                <p className='w-full'>Longtitude: {data.routeCoordinate.lng}</p>
              </div>

              <div className='flex gap-2'>
                <p>Tags:</p>
                {data.tags.map((tag, index) => (
                  <p key={index}>#{tag}</p>
                ))}
              </div>

              <div className='flex gap-2'>
                <p>Snow buddies:</p>
                {data.snowBuddies.map((buddy, index) => (
                  <p key={index}>{buddy}</p>
                ))}
              </div>

              <div className='flex gap-2'>
                <p>View counts:</p>
                <p>{data.viewCount}</p>
              </div>

              <div className='flex flex-col gap-4'>
                {data.spots.map((spot, index) => (
                  <div key={index} className='flex flex-col'>
                    <div
                      className='mb-2 flex cursor-pointer flex-wrap justify-between'
                      onClick={() => toggleVisibility(index)}
                    >
                      <p className='w-fit pr-2 font-bold'>
                        {index} | {spot.spotTitle}
                      </p>
                      {spotsVisibility[index] ? (
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke-width='1.5'
                          stroke='currentColor'
                          className='h-6 w-6'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M4.5 15.75l7.5-7.5 7.5 7.5'
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke-width='1.5'
                          stroke='currentColor'
                          className='h-6 w-6'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M19 9l-7 7-7-7'
                          ></path>
                        </svg>
                      )}
                      <div className='w-full border border-zinc-300' />
                    </div>
                    {spotsVisibility[index] && (
                      <div className='mb-2 flex flex-col gap-2 bg-zinc-100'>
                        {spot.spotDescription && <p>Description: {spot.spotDescription}</p>}
                        {spot.imageUrls && (
                          <div className='flex gap-2'>
                            {spot.imageUrls.map((url, i) => (
                              <img key={i} src={url} alt={`Image ${i}`} className='h-auto w-8' />
                            ))}
                          </div>
                        )}
                        {spot.videoUrls && (
                          <div className='flex gap-2'>
                            {spot.videoUrls.map((url, i) => (
                              <video key={i} controls width='150' height='100'>
                                <source src={url} type='video/mp4' />
                              </video>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div
                className='flex w-full cursor-pointer flex-wrap justify-between border-zinc-300'
                onClick={() => toggleCommentVisibility()}
              >
                <p className='text-lg font-bold'>Comment</p>
                {commentVisibility ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke-width='1.5'
                    stroke='currentColor'
                    className='h-6 w-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M4.5 15.75l7.5-7.5 7.5 7.5'
                    ></path>
                  </svg>
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke-width='1.5'
                    stroke='currentColor'
                    className='h-6 w-6'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7'></path>
                  </svg>
                )}
                <div className='w-full border border-zinc-300' />
              </div>
              {commentVisibility && (
                <div>
                  <textarea className='h-20 w-full resize-none' />
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <p>No such route</p>
      )}
    </div>
  )
}

export default RouteView
