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
import { Link, useParams } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import { db } from '../../auth/CloudStorage'
import RouteCard from '../../components/RouteCard'
import { useRouteCardStore } from '../../store/useRouteCard'
import { User, useUserStore } from '../../store/useUser'
import AboutMeIcon from './about-me-icon.png'
import Bookmark from './bookmark.png'
import CalenderIcon from './calendar-icon.png'
import CountryIcon from './country-icon.png'
import EditIcon from './edit.png'
import ViewIcon from './eye.png'
import FollowerIcon from './follower-icon.png'
import FriendIcon from './friend-icon.png'
import GenderIcon from './gender-icon.png'
import RouteIcon from './route-icon.png'
import SkiIcon from './skiing-icon.png'
import SnowboardIcon from './snowboarder-icon.png'

interface RouteDocsInList {
  listName: string
  routeDoc: DocumentData[]
}

const Member = () => {
  const { memberID } = useParams<{ memberID: string }>()
  const { userDoc, isLoadedUserDoc } = useUserStore()
  const [memberDoc, setMemberDoc] = useState<User>()
  const [userCreatedRoutes, setUserCreatedRoutes] = useState<DocumentData[]>([])
  const [userStoredLists, setUserStoredLists] = useState<RouteDocsInList[]>([])
  const [isFollowing, setIsFollowing] = useState<boolean>(false)
  const [isInviting, setIsInviting] = useState<boolean>(false)
  const [isFriend, setIsFriend] = useState<boolean>(false)
  const [isMyself, setIsMyself] = useState<boolean>(false)
  const [viewCount, setViewCount] = useState<number>(0)
  const { setSelectedImages, setLikeRouteCards, setDislikeRouteCards } = useRouteCardStore()

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

  // const navigate = useNavigate()

  // useEffect(() => {
  //   if (isLoadedPage && !isSignIn) {
  //     toast.warn('Please sign in to view your page', {
  //       position: 'top-right',
  //       autoClose: 1000,
  //       hideProgressBar: false,
  //       closeOnClick: false,
  //       pauseOnHover: false,
  //       draggable: false,
  //       progress: undefined,
  //       theme: 'light',
  //       onClose: () => {
  //         navigate('/signin')
  //       }
  //     })
  //   } else if (isLoadedUserDoc && userDoc.username === undefined) {
  //     toast.warn("You haven't finish your profile", {
  //       position: 'top-right',
  //       autoClose: 1000,
  //       hideProgressBar: false,
  //       closeOnClick: false,
  //       pauseOnHover: false,
  //       draggable: false,
  //       progress: undefined,
  //       theme: 'light',
  //       onClose: () => {
  //         navigate('/member-info')
  //       }
  //     })
  //   }
  // }, [userDoc])

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

  useEffect(() => {
    const initialLikeRouteCard: { [routeID: string]: boolean } = {}
    const initialDislikeRouteCard: { [routeID: string]: boolean } = {}

    const handleLikeDislikeState = (list: DocumentData[]) => {
      list.forEach((route) => {
        if (route.likeUsers.includes(userDoc.userID)) {
          initialLikeRouteCard[route.routeID] = true
        } else {
          initialLikeRouteCard[route.routeID] = false
        }

        if (route.dislikeUsers.includes(userDoc.userID)) {
          initialDislikeRouteCard[route.routeID] = true
        } else {
          initialDislikeRouteCard[route.routeID] = false
        }
      })
    }

    if (userDoc?.userID) {
      if (userCreatedRoutes.length > 0) {
        handleLikeDislikeState(userCreatedRoutes)
      }
      if (userStoredLists.length > 0) {
        userStoredLists.forEach((map) => {
          if (map.routeDoc.length > 0) {
            handleLikeDislikeState(map.routeDoc)
          }
        })
      }

      setLikeRouteCards(initialLikeRouteCard)
      setDislikeRouteCards(initialDislikeRouteCard)
    }
  }, [userCreatedRoutes, userStoredLists, userDoc])

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

  useEffect(() => {
    let count = 0
    userCreatedRoutes.forEach((route) => {
      count += route.viewCount
    })
    setViewCount(count)
  }, [userCreatedRoutes])

  return (
    <div className='flex justify-center p-8'>
      <div className='mb-8 w-[1280px]'>
        <div className='mb-16 flex w-full gap-8'>
          <img
            className='max-w-32 max-h-32 rounded-full object-cover shadow-[5px_10px_15px_-8px_#555555]'
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
                    className='flex h-fit w-fit items-center gap-2 rounded-2xl bg-zinc-200 pl-4 pr-4 text-lg font-bold hover:bg-zinc-300'
                    to='/member-info'
                  >
                    <img src={EditIcon} alt='Edit icon' className='h-4 w-4' />
                    Edit info
                  </Link>
                )}
              </div>

              <div className='flex gap-20'>
                <div className='flex flex-col gap-2'>
                  <div className='flex items-center gap-2'>
                    <div className='flex items-center gap-2'>
                      <img src={RouteIcon} alt=' icon' className='h-5 w-5' />
                      <p className='text-xl font-bold'>Routes:</p>
                    </div>
                    <p className='text-lg'>{memberDoc?.userRouteIDs.length}</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <img src={ViewIcon} alt='View icon' className='h-5 w-5' />
                    <p className='text-xl font-bold'>Views:</p>
                    <p className='text-lg'>{viewCount}</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <img src={FriendIcon} alt=' icon' className='h-5 w-5' />
                    <p className='text-xl font-bold'>Friends:</p>
                    <p className='text-lg'>{memberDoc?.userFriends.length}</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <img src={FollowerIcon} alt=' icon' className='h-5 w-5' />
                    <p className='text-xl font-bold'>Followers:</p>
                    <p className='text-lg'>{memberDoc?.userFollowers.length}</p>
                  </div>
                </div>

                <div className='flex flex-col gap-2'>
                  <div className='flex items-center gap-2'>
                    <img src={SkiIcon} alt=' icon' className='h-5 w-5' />
                    <p className='text-xl font-bold'>Ski Age:</p>
                    <p className='text-lg'>{memberDoc?.userSkiAge}</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <img src={SnowboardIcon} alt=' icon' className='h-5 w-5' />
                    <p className='text-xl font-bold'>Snowboard Age:</p>
                    <p className='text-lg'>{memberDoc?.userSnowboardAge}</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <img src={GenderIcon} alt=' icon' className='h-5 w-5' />
                    <p className='text-xl font-bold'>Gender:</p>
                    <p className='text-lg'>{memberDoc?.userGender}</p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <img src={CountryIcon} alt=' icon' className='h-5 w-5' />
                    <p className='text-xl font-bold'>Country:</p>
                    <p className='text-lg'>{memberDoc?.userCountry}</p>
                  </div>
                </div>

                <div className='flex flex-col gap-2'>
                  <div className='flex items-center gap-2'>
                    <img src={CalenderIcon} alt=' icon' className='h-5 w-5' />
                    <p className='text-xl font-bold'>Joined Time:</p>
                    <p className='text-lg'>
                      {memberDoc?.userJoinedTime &&
                        formatTimestamp(memberDoc?.userJoinedTime as Timestamp)}
                    </p>
                  </div>

                  <div className='flex flex-col gap-2'>
                    <div className='flex items-center gap-2'>
                      <img src={AboutMeIcon} alt=' icon' className='h-5 w-5' />
                      <p className='text-xl font-bold'>About me:</p>
                    </div>
                    <p className='max-w-lg text-justify text-lg'>{memberDoc?.userDescription}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col items-center'>
          <div className='mb-16 w-[900px]'>
            <div className='mb-4 flex items-center gap-8'>
              <p className='text-3xl font-bold'>My Routes</p>
              <Link
                to='/edit-route'
                className='rounded-2xl bg-zinc-200 pl-4 pr-4 text-lg font-bold hover:bg-zinc-300'
              >
                + Create new route
              </Link>
            </div>
            <div className='flex items-center justify-center'>
              <div className='flex w-full flex-col flex-wrap gap-4'>
                {userCreatedRoutes && <RouteCard data={userCreatedRoutes} />}
              </div>
            </div>
          </div>

          <div className='mb-16 w-[900px]'>
            <p className='mb-4 text-3xl font-bold'>Saved Routes</p>
            <div className='flex flex-col gap-10'>
              {userStoredLists.length > 0 ? (
                userStoredLists.map((map, index) => (
                  <div key={index}>
                    <div className='mb-1 flex items-center gap-2'>
                      <img src={Bookmark} alt='Bookmark icon' className='h-4 w-4' />
                      <p className='text-2xl font-bold'>{map.listName}</p>
                    </div>
                    <div className='flex w-full flex-col flex-wrap gap-4'>
                      {map.routeDoc.length === 0 ? (
                        <p className='mb-2 text-lg font-bold text-zinc-400'>
                          Currently no route in this list
                        </p>
                      ) : (
                        <RouteCard data={map.routeDoc} />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className='mb-2 text-lg font-bold text-zinc-400'>
                  Currently haven't save any route
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Member
