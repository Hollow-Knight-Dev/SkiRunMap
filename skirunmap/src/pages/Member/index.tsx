import {
  DocumentData,
  Timestamp,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { db } from '../../auth/CloudStorage'
import { Spot } from '../../store/useRoute'
import { User, useUserStore } from '../../store/useUser'

// import LeftArrow from './left_arrow.png'
// import RightArrow from './right_arrow.png'

interface RouteDocsInList {
  listName: string
  routeDoc: DocumentData[]
}

const Member = () => {
  console.log("I'm in!")
  const { memberID } = useParams<{ memberID: string }>()
  const { userDoc, isLoadedUserDoc, isSignIn } = useUserStore()
  const [memberDoc, setMemberDoc] = useState<User>()
  const [userCreatedRoutes, setUserCreatedRoutes] = useState<DocumentData[]>([])
  const [userStoredLists, setUserStoredLists] = useState<RouteDocsInList[]>([])
  const [isFollowing, setIsFollowing] = useState<boolean>(false)
  const [isInviting, setIsInviting] = useState<boolean>(false)
  const [isFriend, setIsFriend] = useState<boolean>(false)
  const [isMyself, setIsMyself] = useState<boolean>(false)
  const [selectedImages, setSelectedImages] = useState<{ [routeID: string]: number }>({})

  useEffect(() => {
    if (isLoadedUserDoc && userDoc.userID === memberID) {
      setIsMyself(true)
      // console.log('userDoc.userID', userDoc.userID)
      // console.log('memberID', memberID)
    } else {
      setIsMyself(false)
      // console.log('2userDoc.userID', userDoc.userID)
      // console.log('2memberID', memberID)
    }
  }, [userDoc])

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

  const navigate = useNavigate()

  useEffect(() => {
    if (isLoadedUserDoc && !isSignIn) {
      toast.warn('Please sign in to view your page', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'light',
        onClose: () => {
          navigate('/signin')
        }
      })
    } else if (isLoadedUserDoc && userDoc.username === undefined) {
      toast.warn("You haven't finish your profile", {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'light',
        onClose: () => {
          navigate('/member-info')
        }
      })
    }
  }, [userDoc])

  const getMemberDoc = async () => {
    if (memberID) {
      const userDoc = await getDoc(doc(db, 'users', memberID))
      const userDocData = userDoc.data() as User
      setMemberDoc(userDocData)
    }
  }

  useEffect(() => {
    getMemberDoc()
  }, [memberID])

  const initialiseFriendStatus = () => {
    if (memberDoc) {
      if (memberDoc.userFollowers.includes(userDoc.userID)) {
        setIsFollowing(true)
      }
      if (memberDoc.userFriends.includes(userDoc.userID)) {
        setIsFriend(true)
      }
      if (memberDoc.userFriendReqs.includes(userDoc.userID)) {
        setIsInviting(true)
      }
    }
  }

  useEffect(() => {
    initialiseFriendStatus()
  }, [userDoc, memberDoc])

  const getUserCreatedRoutes = async () => {
    if (memberDoc) {
      const routeIDs = memberDoc.userRouteIDs
      if (routeIDs.length > 0) {
        const routesQuery = query(collection(db, 'routes'), where('routeID', 'in', routeIDs))
        const routeDocsSnapshot = await getDocs(routesQuery)
        const userRoutesData = routeDocsSnapshot.docs.map((doc) => doc.data())
        setUserCreatedRoutes(userRoutesData)
        // console.log(userRoutesData)
      }
    }
  }

  const getUserStoredLists = async () => {
    if (memberDoc) {
      const storeRoutes = memberDoc.userRouteLists
      let routeLists: RouteDocsInList[] = []
      await Promise.all(
        storeRoutes.map(async (map) => {
          // console.log(map)
          if (map.routeIDs.length > 0) {
            // console.log('map.routeIDs', map.routeIDs)
            const routesQuery = query(
              collection(db, 'routes'),
              where('routeID', 'in', map.routeIDs)
            )
            const routeDocsSnapshot = await getDocs(routesQuery)
            const routesData = routeDocsSnapshot.docs.map((doc) => doc.data())
            routeLists.push({
              listName: map.listName,
              routeDoc: routesData
            })
          } else {
            routeLists.push({
              listName: map.listName,
              routeDoc: []
            })
          }
        })
      )
      setUserStoredLists(routeLists)
      // console.log(routeLists)
    }
  }

  useEffect(() => {
    getUserCreatedRoutes()
    getUserStoredLists()
  }, [memberID, memberDoc])

  const handleFollow = async () => {
    console.log('click Follow')
    if (memberID && userDoc.userID) {
      const myUserRef = doc(db, 'users', userDoc.userID)
      const otherUserRef = doc(db, 'users', memberID)
      await updateDoc(otherUserRef, { userFollowers: arrayUnion(userDoc.userID) })
      await updateDoc(myUserRef, { userFollows: arrayUnion(memberID) })
      setIsFollowing(true)
    }
  }

  const handleUnfollow = async () => {
    console.log('click Unfollow')
    if (memberID && userDoc.userID) {
      const myUserRef = doc(db, 'users', userDoc.userID)
      const otherUserRef = doc(db, 'users', memberID)
      await updateDoc(otherUserRef, { userFollowers: arrayRemove(userDoc.userID) })
      await updateDoc(myUserRef, { userFollows: arrayRemove(memberID) })
      setIsFollowing(false)
    }
  }

  const handleFriendInvite = async () => {
    console.log('Click wanna be friend')
    if (memberID && userDoc.userID) {
      const myUserRef = doc(db, 'users', userDoc.userID)
      const otherUserRef = doc(db, 'users', memberID)
      await updateDoc(otherUserRef, { userFriendReqs: arrayUnion(userDoc.userID) })
      await updateDoc(myUserRef, { userSentFriendReqs: arrayUnion(memberID) })
      setIsInviting(true)
    }
  }

  const handleWithdrawInvitation = async () => {
    console.log('Withdraw Invitation')
    if (memberID && userDoc.userID) {
      const myUserRef = doc(db, 'users', userDoc.userID)
      const otherUserRef = doc(db, 'users', memberID)
      await updateDoc(otherUserRef, { userFriendReqs: arrayRemove(userDoc.userID) })
      await updateDoc(myUserRef, { userSentFriendReqs: arrayRemove(memberID) })
      setIsInviting(false)
    }
  }

  const handleFriendBreakUp = async () => {
    console.log('FriendBreakUp')
    if (memberID && userDoc.userID) {
      const myUserRef = doc(db, 'users', userDoc.userID)
      const otherUserRef = doc(db, 'users', memberID)
      await updateDoc(otherUserRef, { userFriends: arrayRemove(userDoc.userID) })
      await updateDoc(myUserRef, { userFriends: arrayRemove(memberID) })
      setIsFriend(false)
    }
  }

  useEffect(() => {
    const initialSelectedImages: { [routeID: string]: number } = {}
    userCreatedRoutes.forEach((route) => {
      initialSelectedImages[route.routeID] = 0
    })
    userStoredLists.forEach((object) => {
      object.routeDoc.forEach((route) => {
        initialSelectedImages[route.routeID] = 0
      })
    })
    setSelectedImages(initialSelectedImages)
  }, [userCreatedRoutes])

  const handleDotClick = (routeID: string, index: number) => {
    setSelectedImages((prev) => ({ ...prev, [routeID]: index }))
  }

  return (
    <div className='p-8'>
      <div className='mb-8 w-full'>
        <div className='flex w-4/5'>
          <img
            className='ml-16 mr-16 h-32 w-32 rounded-full object-cover shadow-[10px_15px_30px_-10px_#4da5fd]'
            src={memberDoc?.userIconUrl}
            alt='Profile Icon'
          />
          <div className='flex w-full justify-between'>
            <div className='flex w-full flex-col'>
              <div className='mb-6 flex w-full items-center justify-between gap-10'>
                <p className='text-3xl font-bold'>{memberDoc?.username}</p>
                {!isMyself ? (
                  <div className='flex gap-2'>
                    {isFollowing ? (
                      <button
                        className='button-shadow h-fit w-fit rounded-2xl bg-blue-100 pl-4 pr-4 text-lg font-bold'
                        onClick={() => handleUnfollow()}
                      >
                        Following
                      </button>
                    ) : (
                      <button
                        className='button-shadow h-fit w-fit rounded-2xl bg-blue-100 pl-4 pr-4 text-lg font-bold'
                        onClick={() => handleFollow()}
                      >
                        Follow
                      </button>
                    )}

                    {isFriend ? (
                      <button
                        className='button-shadow h-fit w-fit rounded-2xl bg-blue-100 pl-4 pr-4 text-lg font-bold'
                        onClick={() => handleFriendBreakUp()}
                      >
                        Friend
                      </button>
                    ) : isInviting ? (
                      <button
                        className='button-shadow h-fit w-fit rounded-2xl bg-blue-100 pl-4 pr-4 text-lg font-bold'
                        onClick={() => handleWithdrawInvitation()}
                      >
                        Inviting
                      </button>
                    ) : (
                      <button
                        className='button-shadow h-fit w-fit rounded-2xl bg-blue-100 pl-4 pr-4 text-lg font-bold'
                        onClick={() => handleFriendInvite()}
                      >
                        Invite
                      </button>
                    )}
                  </div>
                ) : (
                  <Link
                    className='button-shadow h-fit w-fit rounded-2xl bg-blue-100 pl-4 pr-4 text-lg font-bold'
                    to='/member-info'
                  >
                    Edit info
                  </Link>
                )}
              </div>
              <div className='mb-2 flex items-center gap-2'>
                <p className='text-xl font-bold'>Joined Time:</p>
                <p className='text-lg'>
                  {memberDoc?.userJoinedTime &&
                    formatTimestamp(memberDoc?.userJoinedTime as Timestamp)}
                </p>
              </div>
              <div className='flex flex-wrap gap-4'>
                <div className='flex items-center gap-2'>
                  <p className='text-xl font-bold'>Routes:</p>
                  <p className='text-lg'>{memberDoc?.userRouteIDs.length}</p>
                </div>
                {/* <div className='flex gap-2'>
                  <p className='text-xl font-bold'>Views:</p>
                  <p className='text-lg'>10</p>
                </div> */}
                <div className='flex items-center gap-2'>
                  <p className='text-xl font-bold'>Friends:</p>
                  <p className='text-lg'>{memberDoc?.userFriends.length}</p>
                </div>
                <div className='flex items-center gap-2'>
                  <p className='text-xl font-bold'>Followers:</p>
                  <p className='text-lg'>{memberDoc?.userFollowers.length}</p>
                </div>
              </div>

              <div className='mb-2 mt-6 flex items-center gap-2'>
                <p className='text-xl font-bold'>About me:</p>
                <p className='text-lg'>{memberDoc?.userDescription}</p>
              </div>
              <div className='flex flex-wrap gap-4'>
                <div className='flex items-center gap-2'>
                  <p className='text-xl font-bold'>Gender:</p>
                  <p className='text-lg'>{memberDoc?.userGender}</p>
                </div>
                <div className='flex items-center gap-2'>
                  <p className='text-xl font-bold'>Country:</p>
                  <p className='text-lg'>{memberDoc?.userCountry}</p>
                </div>
                <div className='flex items-center gap-2'>
                  <p className='text-xl font-bold'>Ski Age:</p>
                  <p className='text-lg'>{memberDoc?.userSkiAge}</p>
                </div>
                <div className='flex items-center gap-2'>
                  <p className='text-xl font-bold'>Snowboard Age:</p>
                  <p className='text-lg'>{memberDoc?.userSnowboardAge}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='mb-16'>
        <p className='mb-4 text-2xl font-bold'>My Routes</p>
        <div className='mb-8 w-full border border-zinc-300' />
        <div className='flex items-center justify-center'>
          <div className='flex w-full flex-col flex-wrap gap-4'>
            {userCreatedRoutes &&
              userCreatedRoutes.map((route, index) => {
                let imageIndex = 0
                return (
                  <div
                    key={index}
                    className='nice-shadow relative h-60 w-full cursor-pointer rounded-2xl bg-blue-50 p-4'
                  >
                    <Link
                      key={`${route.routeID}_${index}`}
                      to={`/route/${route.routeID}`}
                      className='absolute left-0 top-0 z-10 h-full w-full cursor-pointer rounded-2xl'
                    />
                    <div className='flex gap-8 text-xl'>
                      <div className='relative h-52 w-52 rounded-xl bg-zinc-200'>
                        <div className='flex h-full w-full'>
                          {route.spots?.map((spot: Spot) =>
                            spot.imageUrls.map((url: string) => (
                              <img
                                key={imageIndex++}
                                src={url}
                                alt={spot.spotTitle}
                                className={`aspect-square rounded-xl object-cover ${
                                  selectedImages[route.routeID] === imageIndex ? 'block' : 'hidden'
                                }`}
                              />
                            ))
                          )}
                        </div>
                        <div className='absolute bottom-2 z-20 flex h-4 w-full flex-wrap items-center justify-center gap-2'>
                          {Array.from({
                            length: route.spots?.reduce(
                              (acc: number, spot: Spot) => acc + spot.imageUrls.length,
                              0
                            )
                          }).map((_, spanIndex) => (
                            <span
                              key={spanIndex}
                              className={`dot h-2 w-2 rounded-full  opacity-70 ${
                                selectedImages[route.routeID] === spanIndex
                                  ? 'bg-blue-500'
                                  : 'bg-white'
                              }`}
                              onClick={() => handleDotClick(route.routeID, spanIndex)}
                            />
                          ))}
                        </div>
                      </div>

                      <div className='flex flex-col gap-6 p-2'>
                        <p className='text-2xl font-bold'>{route.routeTitle}</p>
                        <p>Likes: {route.likeCount}</p>
                        <div className='flex flex-wrap gap-2'>
                          <p>Tag: </p>
                          {route.tags.length > 0 ? (
                            route.tags.map((tag: string, index: number) => (
                              <Link
                                key={`${route.routeID}_tag_${index}`}
                                to={`/search/${tag}`}
                                className='rounded-xl bg-blue-100 pl-2 pr-2'
                              >
                                # {tag}
                              </Link>
                            ))
                          ) : (
                            <p>None</p>
                          )}
                        </div>
                        <div className='flex flex-wrap gap-2'>
                          <p>Spots: </p>
                          {route.spots.length > 0 ? (
                            route.spots?.map((spot: Spot, index: number) => (
                              <Link
                                key={`${route.routeID}_spot_${index}`}
                                to={`/search/${spot.spotTitle}`}
                                className='rounded-xl bg-blue-100 pl-2 pr-2'
                              >
                                {spot.spotTitle}
                              </Link>
                            ))
                          ) : (
                            <p>None</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      <div className='mb-16'>
        <p className='mb-4 text-2xl font-bold'>My Favorite Routes</p>
        <div className='mb-8 w-full border border-zinc-300' />
        <div className='flex items-center justify-center'>
          <div className='flex w-3/4 flex-col gap-10'>
            {userStoredLists &&
              userStoredLists.map((map, index) => (
                <div key={index}>
                  <p className='mb-2 text-2xl font-bold'>{map.listName}</p>
                  <div className='mb-6 w-full border border-zinc-300' />
                  <div className='flex w-full flex-col flex-wrap gap-4'>
                    {map.routeDoc.length === 0 && (
                      <p className='mb-2 text-lg font-bold text-zinc-400'>
                        Currently no route in this list
                      </p>
                    )}
                    {map.routeDoc.map((route, index) => {
                      let imageIndex = 0
                      return (
                        <div
                          key={index}
                          className='nice-shadow relative h-60 w-full cursor-pointer rounded-2xl bg-blue-50 p-4'
                        >
                          <Link
                            key={`${route.routeID}_${index}`}
                            to={`/route/${route.routeID}`}
                            className='absolute left-0 top-0 z-10 h-full w-full cursor-pointer rounded-2xl'
                          />
                          <div className='flex gap-8 text-xl'>
                            <div className='relative h-52 w-52 rounded-xl bg-zinc-200'>
                              <div className='flex h-full w-full'>
                                {route.spots?.map((spot: Spot) =>
                                  spot.imageUrls.map((url: string) => (
                                    <img
                                      key={imageIndex++}
                                      src={url}
                                      alt={spot.spotTitle}
                                      className={`aspect-square rounded-xl object-cover ${
                                        selectedImages[route.routeID] === imageIndex
                                          ? 'block'
                                          : 'hidden'
                                      }`}
                                    />
                                  ))
                                )}
                              </div>
                              <div className='absolute bottom-2 z-20 flex h-4 w-full flex-wrap items-center justify-center gap-2'>
                                {Array.from({
                                  length: route.spots?.reduce(
                                    (acc: number, spot: Spot) => acc + spot.imageUrls.length,
                                    0
                                  )
                                }).map((_, spanIndex) => (
                                  <span
                                    key={spanIndex}
                                    className={`dot h-2 w-2 rounded-full  opacity-70 ${
                                      selectedImages[route.routeID] === spanIndex
                                        ? 'bg-blue-500'
                                        : 'bg-white'
                                    }`}
                                    onClick={() => handleDotClick(route.routeID, spanIndex)}
                                  />
                                ))}
                              </div>
                            </div>

                            <div className='flex flex-col gap-6 p-2'>
                              <p className='text-2xl font-bold'>{route.routeTitle}</p>
                              <p>Likes: {route.likeCount}</p>
                              <div className='flex flex-wrap gap-2'>
                                <p>Tag: </p>
                                {route.tags.length > 0 ? (
                                  route.tags.map((tag: string, index: number) => (
                                    <Link
                                      key={`${route.routeID}_tag_${index}`}
                                      to={`/search/${tag}`}
                                      className='rounded-xl bg-blue-100 pl-2 pr-2'
                                    >
                                      # {tag}
                                    </Link>
                                  ))
                                ) : (
                                  <p>None</p>
                                )}
                              </div>
                              <div className='flex flex-wrap gap-2'>
                                <p>Spots: </p>
                                {route.spots.length > 0 ? (
                                  route.spots?.map((spot: Spot, index: number) => (
                                    <Link
                                      key={`${route.routeID}_spot_${index}`}
                                      to={`/search/${spot.spotTitle}`}
                                      className='rounded-xl bg-blue-100 pl-2 pr-2'
                                    >
                                      {spot.spotTitle}
                                    </Link>
                                  ))
                                ) : (
                                  <p>None</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Member
