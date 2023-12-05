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
  const [routeDocData, setRouteDocData] = useState<Route>()
  const [userDocData, setUserDocData] = useState<User>()
  const [spotsVisibility, setSpotsVisibility] = useState<VisibilityState>({})
  const [userExistedLists, setUserExistedLists] = useState<StoreRouteLists[]>([])
  const [isCreatingList, setIsCreatingList] = useState<boolean>(false)
  const [createListName, setCreateListName] = useState<string>('')
  const [isOpeningBookmark, setIsOpeningBookmark] = useState<boolean>(false)
  const [selectedLists, setSelectedLists] = useState<string[]>([])

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
          setRouteDocData(routeData as Route)
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

  useEffect(() => {
    if (routeDocData) {
      markSpots(routeDocData.spots)
    }
  }, [map])

  useEffect(() => {
    if (id && isSignIn) {
      onSnapshot(doc(db, 'users', userDoc.userID), (doc) => {
        const userData = doc.data() as User
        setUserDocData(userData)
      })
    }
  }, [userDoc])

  useEffect(() => {
    if (userDoc && routeDocData) {
      if (routeDocData?.likeUsers.includes(userDoc.userID)) {
        setIsLike(true)
      } else {
        setIsLike(false)
      }
      if (routeDocData?.dislikeUsers.includes(userDoc.userID)) {
        setIsDislike(true)
      } else {
        setIsDislike(false)
      }
    }
  }, [routeDocData, userDoc])

  useEffect(() => {
    if (userDocData && id) {
      const userRouteLists = userDocData.userRouteLists
      setUserExistedLists(userRouteLists)

      const initialiseSelectedLists = userRouteLists
        .filter((list) => list.routeIDs.includes(id))
        .map((list) => list.listName)
      setSelectedLists(initialiseSelectedLists)
      // console.log('selectedLists:', selectedLists)
    }
  }, [userDocData])

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
    console.log('click like')
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
    console.log('click dislike')
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

  const handleClickBookmark = () => {
    if (isSignIn) {
      setIsOpeningBookmark((prev) => !prev)
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

  const handleCreateListInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setCreateListName(input)
  }

  const handleClickCreateList = () => {
    setIsCreatingList((prev) => !prev)
  }

  const handleCreateList = async () => {
    if (createListName.trim() === '') {
      toast.warn("You haven't type in list name!", {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'light'
      })
    } else if (id && isSignIn && userDocData) {
      const userRef = doc(db, 'users', userDoc.userID)
      const userListData = userDocData.userRouteLists
      // console.log(userListData)

      const hasListName = userListData.some((item) => item.listName === createListName)
      // console.log(hasListName)

      if (!hasListName) {
        setIsCreatingList(false)
        const data: StoreRouteLists = { listName: createListName, routeIDs: [] }
        await updateDoc(userRef, { userRouteLists: arrayUnion(data) })
        toast.success(`List ${createListName} created!`, {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: 'light'
        })
        setCreateListName('')
      } else {
        toast.warn('The list name is already created!', {
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
  }

  const handleListCheckboxChange = async (listName: string, isChecked: boolean) => {
    setSelectedLists((prevSelectedLists) => {
      return isChecked
        ? [...prevSelectedLists, listName]
        : prevSelectedLists.filter((name) => name !== listName)
    })

    if (id && isSignIn && userDocData) {
      const userRef = doc(db, 'users', userDoc.userID)
      const updatedUserRouteLists = userDocData.userRouteLists.map((list) => {
        if (list.listName === listName) {
          const routeIDs = isChecked
            ? [...list.routeIDs, id]
            : list.routeIDs.filter((routeID) => routeID !== id)
          return { ...list, routeIDs }
        }
        return list
      })
      await updateDoc(userRef, { userRouteLists: updatedUserRouteLists })
      if (isChecked) {
        toast.success(`Route has been added into list: ${listName}`, {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: 'light'
        })
      } else {
        toast.success(`Route has been removed from list: ${listName}`, {
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
  }

  return (
    <div className='h-screen-64px flex'>
      {routeDocData ? (
        <>
          <div className='flex w-2/3 flex-col bg-zinc-100'>
            {routeDocData.gpxUrl && <Map gpxUrl={routeDocData.gpxUrl} createMode={false} />}
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
              <div className='z-10 pl-10' onMouseLeave={() => setIsOpeningBookmark(false)}>
                <div
                  className='mb-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white bg-opacity-70 hover:bg-amber-100 hover:bg-opacity-100'
                  onClick={() => handleClickBookmark()}
                  title='Save to list'
                >
                  <img className='h-auto w-3/5' src={BookmarkIcon} alt='Bookmark Icon' />
                </div>
                {isOpeningBookmark && (
                  <div className='absolute right-14 top-6 mt-3 flex flex-col rounded-xl bg-white p-2 opacity-90'>
                    {userExistedLists &&
                      userExistedLists.map((list, index) => (
                        <div
                          className='flex w-full cursor-pointer gap-2 rounded-xl pl-2 pr-2 hover:bg-zinc-200'
                          key={index}
                        >
                          <input
                            className='cursor-pointer'
                            type='checkbox'
                            checked={selectedLists.includes(list.listName)}
                            onChange={(e) =>
                              handleListCheckboxChange(list.listName, e.target.checked)
                            }
                          />
                          <p>{list.listName}</p>
                        </div>
                      ))}
                    <p
                      className='w-full cursor-pointer rounded-xl pl-2 pr-2 hover:bg-zinc-200'
                      onClick={() => handleClickCreateList()}
                    >
                      + create new list
                    </p>
                    {isCreatingList && (
                      <>
                        <input
                          className='m-2 rounded-xl border border-zinc-400 pl-2 placeholder-black placeholder-opacity-80'
                          placeholder='Enter list name'
                          type='text'
                          value={createListName}
                          onChange={(e) => handleCreateListInput(e)}
                        />
                        <div className='flex w-full justify-between pl-2 pr-2'>
                          <button
                            className='rounded-xl bg-zinc-200 pl-2 pr-2'
                            onClick={() => handleCreateList()}
                          >
                            Confirm
                          </button>
                          <button
                            className='rounded-xl bg-zinc-100 pl-2 pr-2'
                            onClick={() => {
                              setIsCreatingList(false)
                              setCreateListName('')
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
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
                  <p>{routeDocData.likeCount}</p>
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
                <p className='text-2xl font-bold'>{routeDocData.routeTitle}</p>
              </div>

              <div className='flex items-center'>
                <img className='h-10 w-10' src={ProfileIcon} alt='Friend Profile Icon' />
                <p className='w-fit pl-4'>
                  {routeDocData.username} · {formattedTime}
                </p>
              </div>

              <div className='flex flex-wrap'>
                <p className='w-full'>Route start coordinate:</p>
                <p className='w-full'>Latitude: {routeDocData.routeCoordinate.lat}</p>
                <p className='w-full'>Longtitude: {routeDocData.routeCoordinate.lng}</p>
              </div>

              <div className='flex gap-2'>
                <p>Tags:</p>
                {routeDocData.tags.map((tag, index) => (
                  <p key={index}>#{tag}</p>
                ))}
              </div>

              <div className='flex gap-2'>
                <p>Snow buddies:</p>
                {routeDocData.snowBuddies.map((buddy, index) => (
                  <p key={index}>{buddy}</p>
                ))}
              </div>

              <div className='flex gap-2'>
                <p>View counts:</p>
                <p>{routeDocData.viewCount}</p>
              </div>

              <div className='flex flex-col gap-4'>
                {routeDocData.spots.map((spot, index) => (
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
