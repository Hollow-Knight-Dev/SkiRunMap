import {
  Timestamp,
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { db } from '../../auth/CloudStorage'
import Map from '../../components/Map'
import { useMapStore } from '../../store/useMap'
import { Route, Spot } from '../../store/useRoute'
import { StoreRouteLists, User, useUserStore } from '../../store/useUser'
import ProfileIcon from './User-icon.png'
import BookmarkIcon from './bookmark.png'
import ClickedDislikeArrow from './clicked-dislike-arrow.png'
import ClickedLikeArrow from './clicked-like-arrow.png'
import SearchIcon from './search-icon.png'
import ShareIcon from './share-icon.png'
import UnclickedDislikeArrow from './unclicked-dislike-arrow.png'
import UnclickedLikeArrow from './unclicked-like-arrow.png'

interface VisibilityState {
  [spotIndex: number]: boolean
}

const RouteView = () => {
  const { id } = useParams<{ id: string }>()
  const { map, infoWindow, setInfoWindow } = useMapStore()
  const { userDoc, isSignIn } = useUserStore()
  const [isLike, setIsLike] = useState<boolean>(false)
  const [isDislike, setIsDislike] = useState<boolean>(false)
  const [data, setData] = useState<Route>()
  const [spotsVisibility, setSpotsVisibility] = useState<VisibilityState>({})
  const [userStoreLists, setUserStoreList] = useState<StoreRouteLists[]>([])

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

  const markSpots = (spots: Spot[]) => {
    spots.forEach((spot) => {
      const marker = new google.maps.Marker({
        position: { lat: spot.spotCoordinate.lat, lng: spot.spotCoordinate.lng },
        map: map,
        icon: {
          url: 'https://firebasestorage.googleapis.com/v0/b/skirunmap.appspot.com/o/logo.png?alt=media&token=d49dbd60-cfea-48a3-b15a-d7de4b1facdd',
          scaledSize: new google.maps.Size(25, 25)
        },
        animation: google.maps.Animation.DROP,
        draggable: false,
        title: `${spot.spotDescription}`
      })
      const openMarkerInfoWindow = () => {
        if (infoWindow) {
          infoWindow.close()
        }
        const generateContentHTML = (spot: Spot) => {
          const imageElements = spot.imageUrls
            .map(
              (imageUrl) => `<img class='info-window-image' src=${imageUrl} alt=${spot.spotTitle}>`
            )
            .join('')
          const videoElements = spot.videoUrls
            .map(
              (videoUrl) =>
                `<iframe src=${videoUrl} height='300' width='400' allowfullscreen></iframe>`
            )
            .join('')

          return `
            <div class='info-window-container'>
              <div class='info-window-text-row'>
                <p class='info-window-title'>Spot Title:</p>
                <p class='info-window-text'>${spot.spotTitle}</p>
              </div>
              <div class='info-window-text-row'>
                <p class='info-window-title'>Spot Description:</p>
                <p class='info-window-text'>${spot.spotDescription}</p>
              </div>
              <div class='info-window-text-row'>
                <p class='info-window-title'>Spot Coordinate:</p>
                <p class='info-window-text'>lat: ${spot.spotCoordinate.lat}<br>lng: ${spot.spotCoordinate.lng}</p>
              </div>
              <div class='info-window-media'>
              ${imageElements}
              ${videoElements}
              </div>
            </div>
          `
        }

        const contentHTML = generateContentHTML(spot)
        const newInfoWindow = new google.maps.InfoWindow({
          content: contentHTML
        })
        newInfoWindow.open(map, marker)
        setInfoWindow(newInfoWindow)
      }

      marker.addListener('click', () => openMarkerInfoWindow())
    })
  }

  useEffect(() => {
    if (id) {
      onSnapshot(doc(db, 'routes', id), (doc) => {
        const routeData = doc.data()
        if (routeData) {
          // console.log(routeData)
          setData(routeData as Route)
          const initialVisibility: VisibilityState = routeData.spots.reduce(
            (acc: VisibilityState, _: Spot, index: number) => ({ ...acc, [index]: true }),
            {}
          )
          setSpotsVisibility(initialVisibility)
          formatTimestamp(routeData?.createTime)
          if (routeData.likeUsers.includes(userDoc.userID)) {
            setIsLike(true)
          } else {
            setIsLike(false)
          }
          if (routeData.dislikeUsers.includes(userDoc.userID)) {
            setIsDislike(true)
          } else {
            setIsDislike(false)
          }
        } else {
          console.error('Fail to get route data from Firestore')
        }
      })
    }
  }, [])

  useEffect(() => {
    if (data) {
      markSpots(data.spots)
    }
  }, [map])

  const handleShareLink = () => {
    const pageUrl = window.location.href
    navigator.clipboard.writeText(pageUrl).then(() => {
      toast.success('Copied!', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'light'
      })
    })
  }

  const handleLikeClick = async () => {
    if (id && isSignIn) {
      const routeRef = doc(db, 'routes', id)
      const docSnap = await getDoc(routeRef)
      const routeData = docSnap.data() as Route
      if (isLike) {
        if (routeData?.likeUsers.includes(userDoc.userID)) {
          await updateDoc(routeRef, { likeUsers: arrayRemove(userDoc.userID) })
        }
      } else {
        if (routeData?.dislikeUsers.includes(userDoc.userID)) {
          await updateDoc(routeRef, { dislikeUsers: arrayRemove(userDoc.userID) })
        }
        if (!routeData?.likeUsers.includes(userDoc.userID)) {
          await updateDoc(routeRef, { likeUsers: arrayUnion(userDoc.userID) })
        }
      }
    } else {
      toast.warn('Sign in to like this route!', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'light'
      })
    }
  }

  const handleDislikeClick = async () => {
    if (id && isSignIn) {
      const routeRef = doc(db, 'routes', id)
      const docSnap = await getDoc(routeRef)
      const routeData = docSnap.data() as Route
      if (isDislike) {
        if (routeData?.dislikeUsers.includes(userDoc.userID)) {
          await updateDoc(routeRef, { dislikeUsers: arrayRemove(userDoc.userID) })
        }
      } else {
        if (routeData?.likeUsers.includes(userDoc.userID)) {
          await updateDoc(routeRef, { likeUsers: arrayRemove(userDoc.userID) })
        }
        if (!routeData?.dislikeUsers.includes(userDoc.userID)) {
          await updateDoc(routeRef, { dislikeUsers: arrayUnion(userDoc.userID) })
        }
      }
    } else {
      toast.warn('Sign in to dislike this route!', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'light'
      })
    }
  }

  const handleStoreRoute = async () => {
    if (id && isSignIn) {
      const userRef = doc(db, 'users', userDoc.userID)
      const docSnap = await getDoc(userRef)
      const userData = docSnap.data() as User
      const userListData = userData.userStoreRoutes
      console.log(userListData)
      setUserStoreList(userListData)
    } else {
      toast.warn('Sign in to save this route!', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'light'
      })
    }
  }

  return (
    <div className='h-screen-64px flex'>
      {data ? (
        <>
          <div className='flex w-2/3 flex-col bg-zinc-100'>
            {data.gpxUrl && <Map gpxUrl={data.gpxUrl} createMode={false} />}
          </div>

          <div className='flex w-1/3 flex-col overflow-x-hidden overflow-y-scroll bg-zinc-200 p-2'>
            <div className='relative mb-2 w-full'>
              <input
                className='w-full rounded-3xl border border-zinc-300 p-1 pl-10'
                placeholder='Ski resort, ski run, or tag name'
              />
              <img className='absolute left-3 top-2 w-5' src={SearchIcon} alt='Search Icon' />
            </div>

            <div className='relative flex justify-end gap-2'>
              <div
                className='z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white bg-opacity-70 hover:bg-amber-100 hover:bg-opacity-100'
                onClick={() => handleStoreRoute()}
                title='Save to list'
              >
                <img className='h-auto w-3/5' src={BookmarkIcon} alt='Bookmark Icon' />
              </div>
              <div className='absolute right-14 top-10 z-10 flex flex-col items-end rounded-xl bg-white p-2 opacity-70'>
                {userDoc.userStoreRoutes &&
                  userDoc.userStoreRoutes.map((list, index) => (
                    <div
                      className='cursor-pointer rounded-xl pl-2 pr-2 hover:bg-zinc-200'
                      key={index}
                    >
                      <p>{list.listName}</p>
                    </div>
                  ))}
                <p className='cursor-pointer rounded-xl pl-2 pr-2 hover:bg-zinc-200'>
                  create new list
                </p>
              </div>

              <div
                className='z-10 mr-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white bg-opacity-70 hover:bg-amber-100 hover:bg-opacity-100'
                onClick={() => handleShareLink()}
                title='Click to Copy Link'
              >
                <img className='h-auto w-3/5' src={ShareIcon} alt='Share Icon' />
              </div>
              <div className='absolute top-2 h-4 w-full rounded-full bg-zinc-300' />
            </div>

            <div className='flex flex-col gap-4 p-2'>
              <div className='ml-3 flex items-center gap-6'>
                <div className='flex flex-col items-center'>
                  <div className='h-fit w-fit cursor-pointer' onClick={() => handleLikeClick()}>
                    {isLike ? (
                      <img className='h-auto w-4' src={ClickedLikeArrow} alt='Clicked like arrow' />
                    ) : (
                      <img
                        className='h-auto w-4'
                        src={UnclickedLikeArrow}
                        alt='Unclicked like arrow'
                      />
                    )}
                  </div>
                  <p>{data.likeCount}</p>
                  <div className='h-fit w-fit cursor-pointer' onClick={() => handleDislikeClick()}>
                    {isDislike ? (
                      <img
                        className='h-auto w-4'
                        src={ClickedDislikeArrow}
                        alt='Clicked dislike arrow'
                      />
                    ) : (
                      <img
                        className='h-auto w-4'
                        src={UnclickedDislikeArrow}
                        alt='Unclicked dislike arrow'
                      />
                    )}
                  </div>
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
                          strokeWidth='1.5'
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
                          strokeWidth='1.5'
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
                        <p>Spot Latitude: {spot.spotCoordinate.lat}</p>
                        <p>Spot Longitude: {spot.spotCoordinate.lng}</p>
                        {spot.imageUrls && (
                          <div className='flex gap-2 overflow-x-auto'>
                            {spot.imageUrls.map((url, i) => (
                              <img
                                key={i}
                                src={url}
                                alt={`Image ${i}`}
                                className='h-auto w-40 object-cover'
                              />
                            ))}
                          </div>
                        )}
                        {spot.videoUrls && (
                          <div className='flex gap-2 overflow-x-auto'>
                            {spot.videoUrls.map((url, i) => (
                              <video key={i} controls width='160' height='auto'>
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
                    strokeWidth='1.5'
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
                    strokeWidth='1.5'
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
        <p>No such route QQ... Please come back to home page</p>
      )}
    </div>
  )
}

export default RouteView
