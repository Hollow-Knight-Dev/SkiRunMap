import {
  Timestamp,
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { db } from '../../auth/Firebase'
import LikeDislike from '../../components/LikeDislike'
import Map from '../../components/Map'
import SearchBar from '../../components/SearchBar'
import ShowOrHideArrowSVG from '../../images/ShowOrHideArrowSVG'
import BookmarkIcon from '../../images/bookmark.png'
import MarkerIcon from '../../images/google-maps-pin.png'
import { useMapStore } from '../../store/useMap'
import { Comment, Route, Spot } from '../../store/useRoute'
import { useRouteCardStore } from '../../store/useRouteCard'
import { StoreRouteLists, User, useUserStore } from '../../store/useUser'
import showToast from '../../utils/showToast'
import LatitudeIcon from './images/latitude.png'
import LongitudeIcon from './images/longitude.png'
import ShareIcon from './images/share-icon.png'

interface VisibilityState {
  [spotIndex: number]: boolean
}

const RouteView = () => {
  const { id } = useParams<{ id: string }>()
  const { map, infoWindow, setInfoWindow } = useMapStore()
  const { userDoc, isSignIn } = useUserStore()
  const [routeDocData, setRouteDocData] = useState<Route>()
  const [userDocData, setUserDocData] = useState<User>()
  const [spotsVisibility, setSpotsVisibility] = useState<VisibilityState>({})
  const [userExistedLists, setUserExistedLists] = useState<StoreRouteLists[]>([])
  const [isCreatingList, setIsCreatingList] = useState<boolean>(false)
  const [createListName, setCreateListName] = useState<string>('')
  const [isOpeningBookmark, setIsOpeningBookmark] = useState<boolean>(false)
  const [selectedLists, setSelectedLists] = useState<string[]>([])
  const [commentInput, setCommentInput] = useState<string>('')
  const [commentsDocData, setCommentsDocData] = useState<Comment[]>()
  const [authorLatestIconUrl, setAuthorLatestIconUrl] = useState<string>('')
  const { setLikeRouteCards, setDislikeRouteCards } = useRouteCardStore()

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

  const formatTimestamp = (timestamp: Timestamp) => {
    const time = timestamp
      .toDate()
      .toLocaleDateString('en-UK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour12: false,
        hour: 'numeric',
        minute: 'numeric'
      })
      .replace(',', ' at')

    return time
  }

  const addViewCount = async (id: string) => {
    const routeRef = doc(db, 'routes', id)
    const docSnapshot = await getDoc(routeRef)
    if (docSnapshot.exists()) {
      await updateDoc(routeRef, { viewCount: increment(1) })
    }
  }

  useEffect(() => {
    if (id) {
      addViewCount(id)
    }
  }, [])

  useEffect(() => {
    if (id) {
      onSnapshot(doc(db, 'routes', id), (doc) => {
        const routeData = doc.data()
        if (routeData) {
          // console.log(routeData)
          setRouteDocData(routeData as Route)
          const initialVisibility: VisibilityState = routeData.spots.reduce(
            (acc: VisibilityState, _: Spot, index: number) => ({ ...acc, [index]: false }),
            {}
          )
          setSpotsVisibility(initialVisibility)
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
    const initialLikeRouteCard: { [routeID: string]: boolean } = {}
    const initialDislikeRouteCard: { [routeID: string]: boolean } = {}

    if (userDoc?.userID && routeDocData) {
      if (routeDocData.likeUsers.includes(userDoc.userID)) {
        initialLikeRouteCard[routeDocData.routeID] = true
      } else {
        initialLikeRouteCard[routeDocData.routeID] = false
      }

      if (routeDocData.dislikeUsers.includes(userDoc.userID)) {
        initialDislikeRouteCard[routeDocData.routeID] = true
      } else {
        initialDislikeRouteCard[routeDocData.routeID] = false
      }

      setLikeRouteCards(initialLikeRouteCard)
      setDislikeRouteCards(initialDislikeRouteCard)
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
    }
  }, [userDocData])

  useEffect(() => {
    if (id && isSignIn) {
      const routeRef = doc(db, 'routes', id)
      const commentsRef = collection(routeRef, 'comments')
      const orderedCommentsQuery = query(commentsRef, orderBy('commentTimestamp', 'desc'))
      onSnapshot(orderedCommentsQuery, (snapshot) => {
        let updatedComments: Comment[] = []
        snapshot.docs.map((doc) => {
          updatedComments.push(doc.data() as Comment)
        })
        setCommentsDocData(updatedComments)
      })
    }
  }, [routeDocData])

  const updateAuthorIconUrl = async () => {
    if (routeDocData) {
      const userRef = doc(db, 'users', routeDocData.userID)
      const userDoc = await getDoc(userRef)
      const userData = userDoc.data() as User
      setAuthorLatestIconUrl(userData.userIconUrl)
    }
  }

  useEffect(() => {
    updateAuthorIconUrl()
  }, [routeDocData])

  const markSpots = (spots: Spot[]) => {
    spots.forEach((spot) => {
      const marker = new google.maps.Marker({
        position: { lat: spot.spotCoordinate.lat, lng: spot.spotCoordinate.lng },
        map: map,
        icon: {
          url: MarkerIcon,
          scaledSize: new google.maps.Size(36, 36)
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
              <div class='info-window-text-row-y-start'>
                <p class='info-window-title'>Spot Coordinate:</p>
                <div class='info-window-latlng'>
                <p class='info-window-text'>lat: ${spot.spotCoordinate.lat}</p>
                <p class='info-window-text'>lng: ${spot.spotCoordinate.lng}</p>
                </div>
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

  const handleShareLink = () => {
    const pageUrl = window.location.href
    navigator.clipboard.writeText(pageUrl).then(() => {
      showToast('success', 'Copied route link!')
    })
  }

  const handleClickBookmark = () => {
    if (isSignIn) {
      setIsOpeningBookmark((prev) => !prev)
    } else {
      showToast('warn', 'Sign in to save this route.')
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
      showToast('warn', 'List name cannot be empty.')
    } else if (id && isSignIn && userDocData) {
      const userRef = doc(db, 'users', userDoc.userID)
      const userListData = userDocData.userRouteLists
      const hasListName = userListData.some((item) => item.listName === createListName)

      if (!hasListName) {
        setIsCreatingList(false)
        const data: StoreRouteLists = { listName: createListName, routeIDs: [] }
        await updateDoc(userRef, { userRouteLists: arrayUnion(data) })
        showToast('success', `List ${createListName} created!`)
        setCreateListName('')
      } else {
        showToast('warn', 'List name already existed.')
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
        showToast('success', `Route has been added into list: ${listName}`)
      } else {
        showToast('success', `Route has been removed from list: ${listName}`)
      }
    }
  }

  const handleCommentInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value
    if (input.length <= 250) {
      setCommentInput(input)
    } else {
      showToast('warn', 'Comment exceeds 250 letters.')
      setCommentInput(input.slice(0, 250))
    }
  }

  const handleCommentSubmit = async () => {
    if (id && isSignIn) {
      const routeRef = doc(db, 'routes', id)
      const newComment = {
        userID: userDoc.userID,
        username: userDoc.username,
        userIconUrl: userDoc.userIconUrl,
        comment: commentInput,
        commentTimestamp: serverTimestamp()
      }
      await addDoc(collection(routeRef, 'comments'), newComment)
      showToast('success', 'Comment submitted!')
      setCommentInput('')
    } else {
      showToast('warn', 'Sign in to leave your comment.')
    }
  }

  const handleCommentEnterSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && commentInput.trim() !== '') {
      handleCommentSubmit()
    }
  }

  return (
    <div className='max-h-screen-contain-header flex'>
      {routeDocData ? (
        <>
          <div className='flex w-2/3 flex-col bg-zinc-100'>
            {routeDocData.gpxUrl && <Map gpxUrl={routeDocData.gpxUrl} createMode={false} />}
          </div>

          <div className='flex w-1/3 flex-col overflow-x-hidden overflow-y-scroll bg-blue-100 p-2'>
            <div className='relative h-fit w-full'>
              <div className='top-18 absolute h-8 w-full'>
                <SearchBar />
              </div>

              <div className='absolute right-0 top-10 flex gap-2'>
                <div className='relative flex justify-end gap-2'>
                  <div className='z-10 pl-10' onMouseLeave={() => setIsOpeningBookmark(false)}>
                    <div
                      className='mb-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full  bg-blue-200 bg-opacity-70 shadow-[2px_5px_5px_-6px_#7e7e7e] duration-300 hover:hover:bg-white hover:bg-opacity-100 hover:shadow-[10px_12px_10px_-12px_#7e7e7e]'
                      onClick={() => handleClickBookmark()}
                      title='Save to list'
                    >
                      <img className='h-auto w-3/5' src={BookmarkIcon} alt='Bookmark Icon' />
                    </div>
                    {isOpeningBookmark && (
                      <div className='absolute right-14 top-6 mt-3 flex w-40 flex-col rounded-xl bg-white p-2 opacity-90'>
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
                    className='z-10 mr-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-200 bg-opacity-70 shadow-[2px_5px_5px_-6px_#7e7e7e] duration-300 hover:hover:bg-white hover:bg-opacity-100 hover:shadow-[10px_12px_10px_-12px_#7e7e7e]'
                    onClick={() => handleShareLink()}
                    title='Click to Copy Link'
                  >
                    <img className='h-auto w-3/5' src={ShareIcon} alt='Share Icon' />
                  </div>
                </div>
              </div>

              <div className='flex flex-col gap-4 p-2 pt-12'>
                <div className='ml-3 flex items-center gap-6'>
                  <div>
                    <LikeDislike data={routeDocData} />
                  </div>
                  <p className='text-2xl font-bold'>{routeDocData.routeTitle}</p>
                </div>

                <div className='mb-4 flex items-center'>
                  <Link to={`/member/${routeDocData.userID}`} className='h-fit w-fit'>
                    <img
                      className='h-10 w-10 rounded-full object-cover'
                      src={authorLatestIconUrl}
                      alt='Friend Profile Icon'
                    />
                  </Link>
                  <Link
                    to={`/member/${routeDocData.userID}`}
                    className='w-fit pl-4 text-lg font-bold'
                  >
                    {routeDocData.username}
                  </Link>
                  <p className='w-fit pl-4'>
                    {routeDocData.createTime &&
                      formatTimestamp(routeDocData.createTime as Timestamp)}
                  </p>
                </div>

                <div className='flex gap-2'>
                  <p className='w-1/2 text-lg font-bold'>Route start coordinate:</p>
                  <div className='flex w-1/2 flex-col justify-start gap-2'>
                    <div className='mt-1 flex items-center gap-2'>
                      <img className='h-6 w-auto' src={LatitudeIcon} alt='Latitude icon' />
                      <p className='w-full '>Latitude: {routeDocData.routeCoordinate.lat}</p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <img className='h-6 w-auto' src={LongitudeIcon} alt='Longitude icon' />
                      <p className='w-full'>Longtitude: {routeDocData.routeCoordinate.lng}</p>
                    </div>
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <p className='text-lg font-bold'>Tags:</p>
                  {routeDocData.tags.map((tag, index) => (
                    <Link
                      key={index}
                      to={`/search/${tag}`}
                      className='rounded-xl bg-blue-300 pl-2 pr-2'
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>

                <div className='flex items-center gap-2'>
                  <p className='text-lg font-bold'>Snow buddies:</p>
                  {routeDocData.snowBuddies.map((buddy, index) => (
                    <p key={index}>{buddy}</p>
                  ))}
                </div>

                <div className='flex items-center gap-2'>
                  <p className='text-lg font-bold'>View counts:</p>
                  <p>{routeDocData.viewCount}</p>
                </div>

                <div className='flex flex-col gap-2'>
                  {routeDocData.spots.length > 0 && <p className='text-lg font-bold'>Spots:</p>}
                  {routeDocData.spots.map((spot, index) => (
                    <div key={index} className='flex flex-col'>
                      <div
                        className='mb-2 flex cursor-pointer flex-wrap justify-between'
                        onClick={() => toggleVisibility(index)}
                      >
                        <div className='mb-1 flex items-center gap-2'>
                          <img className='h-6 w-auto' src={MarkerIcon} alt='Map pin' />
                          <p className='w-fit pr-2 text-lg font-bold'>{spot.spotTitle}</p>
                        </div>
                        <ShowOrHideArrowSVG isShown={spotsVisibility[index]} />
                        <div className='w-full border border-zinc-300' />
                      </div>
                      {spotsVisibility[index] && (
                        <div className='mb-2 flex flex-col gap-2 pl-2'>
                          {spot.spotDescription && (
                            <p className='font-bold'>{spot.spotDescription}</p>
                          )}
                          <div className='flex flex-col gap-1 text-base'>
                            <div className='flex items-center gap-2'>
                              <img className='h-4 w-auto' src={LatitudeIcon} alt='Latitude icon' />
                              <p className='w-full text-sm'>Latitude: {spot.spotCoordinate.lat}</p>
                            </div>
                            <div className='flex items-center gap-2'>
                              <img
                                className='h-4 w-auto'
                                src={LongitudeIcon}
                                alt='Longitude icon'
                              />
                              <p className='w-full text-sm'>
                                Longtitude: {spot.spotCoordinate.lng}
                              </p>
                            </div>
                          </div>
                          {spot.imageUrls && (
                            <div className='flex gap-2 overflow-x-auto'>
                              {spot.imageUrls.map((url, i) => (
                                <img
                                  key={i}
                                  src={url}
                                  alt={`Image ${i}`}
                                  className='h-auto w-1/2 object-cover'
                                />
                              ))}
                            </div>
                          )}
                          {spot.videoUrls && (
                            <div className='flex gap-2 overflow-x-auto'>
                              {spot.videoUrls.map((url, i) => (
                                <video key={i} controls width='50%' height='auto'>
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

                <div className='flex flex-col gap-2'>
                  <div
                    className='flex w-full cursor-pointer flex-wrap justify-between border-zinc-300'
                    onClick={() => toggleCommentVisibility()}
                  >
                    <p className='text-lg font-bold'>Comment</p>
                    <ShowOrHideArrowSVG isShown={commentVisibility} />
                    <div className='w-full border border-zinc-300' />
                  </div>
                  {commentVisibility && (
                    <div className='mb-4 flex flex-col items-start'>
                      <textarea
                        className='mb-4 h-32 w-full resize-none rounded-lg p-2'
                        value={commentInput}
                        placeholder='Comment on this route'
                        onChange={(e) => handleCommentInput(e)}
                        onKeyDown={(e) => handleCommentEnterSubmit(e)}
                      />
                      <button
                        className='mb-6 self-end rounded-xl bg-blue-300 pl-2 pr-2 font-bold'
                        onClick={() => handleCommentSubmit()}
                      >
                        Submit
                      </button>
                      {commentsDocData &&
                        commentsDocData.map((comment, index) => (
                          <div key={index} className='mb-4 h-fit w-full'>
                            <div className='flex items-center justify-between'>
                              <Link
                                to={`/member/${comment.userID}`}
                                className='flex items-center gap-2'
                              >
                                <img
                                  className='h-4 w-4 rounded-full'
                                  src={comment.userIconUrl}
                                  alt='User icon'
                                />
                                <p>{comment.username}</p>
                              </Link>
                              <p className='justify-self-end text-sm'>
                                {comment.commentTimestamp &&
                                  formatTimestamp(comment.commentTimestamp as Timestamp)}
                              </p>
                            </div>

                            <p>{comment.comment}</p>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
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
