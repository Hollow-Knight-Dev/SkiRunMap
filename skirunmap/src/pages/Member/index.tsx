import {
  DocumentData,
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { db } from '../../auth/CloudStorage'
import { User, useUserStore } from '../../store/useUser'

// import LeftArrow from './left_arrow.png'
// import RightArrow from './right_arrow.png'

interface RouteDocsInList {
  listName: string
  routeDoc: DocumentData[]
}

const Member = () => {
  const { memberID } = useParams<{ memberID: string }>()
  const { userDoc } = useUserStore()
  const [memberDoc, setMemberDoc] = useState<User>()
  const [userCreatedRoutes, setUserCreatedRoutes] = useState<DocumentData[]>([])
  const [userStoredLists, setUserStoredLists] = useState<RouteDocsInList[]>([])

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
    if (Object.keys(userDoc).length !== 0 && userDoc.username === undefined) {
      toast.warn(`You haven't finish your profile`, {
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

  const getUserCreatedRoutes = async () => {
    if (memberDoc) {
      const routeIDs = memberDoc.userRouteIDs
      const routesQuery = query(collection(db, 'routes'), where('routeID', 'in', routeIDs))
      const routeDocsSnapshot = await getDocs(routesQuery)
      const userRoutesData = routeDocsSnapshot.docs.map((doc) => doc.data())
      setUserCreatedRoutes(userRoutesData)
      // console.log(userRoutesData)
    }
  }

  useEffect(() => {
    getUserCreatedRoutes()
    getUserStoredLists()
  }, [memberID, memberDoc])

  const getUserStoredLists = async () => {
    if (memberDoc) {
      const storeRoutes = memberDoc.userRouteLists
      let routeLists: RouteDocsInList[] = []
      await Promise.all(
        storeRoutes.map(async (map) => {
          console.log(map)
          if (map.routeIDs.length > 0) {
            console.log('map.routeIDs', map.routeIDs)
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
      console.log(routeLists)
    }
  }

  return (
    <div className='p-8'>
      <div className='mb-8 w-full'>
        <div className='flex'>
          <img
            className='ml-10 mr-10 h-28 w-28 rounded-full shadow-[10px_15px_30px_-10px_#4da5fd]'
            src={memberDoc?.userIconUrl}
            alt='Profile Icon'
          />
          <div className='flex w-full justify-between'>
            <div className='flex flex-col'>
              <p className='mb-4 text-3xl font-bold'>{memberDoc?.username}</p>
              <div className='mb-2 flex gap-1'>
                <p className='text-xl font-bold'>Joined Time:</p>
                <p className='text-lg'>
                  {memberDoc?.userJoinedTime &&
                    formatTimestamp(memberDoc?.userJoinedTime as Timestamp)}
                </p>
              </div>
              <div className='flex gap-3'>
                <div className='flex gap-1'>
                  <p className='text-xl font-bold'>Routes:</p>
                  <p className='text-lg'>{memberDoc?.userRouteIDs.length}</p>
                </div>
                <div className='flex gap-1'>
                  <p className='text-xl font-bold'>Views:</p>
                  <p className='text-lg'>10</p>
                </div>
                <div className='flex gap-1'>
                  <p className='text-xl font-bold'>Friends:</p>
                  <p className='text-lg'>{memberDoc?.userFriends.length}</p>
                </div>
                <div className='flex gap-1'>
                  <p className='text-xl font-bold'>Followers:</p>
                  <p className='text-lg'>{memberDoc?.userFollowers.length}</p>
                </div>
              </div>
              <div className='flex gap-3'>
                <div className='flex gap-1'>
                  <p className='text-xl font-bold'>Gender:</p>
                  <p className='text-lg'>{memberDoc?.userGender}</p>
                </div>
                <div className='flex gap-1'>
                  <p className='text-xl font-bold'>Country:</p>
                  <p className='text-lg'>{memberDoc?.userCountry}</p>
                </div>
                <div className='flex gap-1'>
                  <p className='text-xl font-bold'>Ski Age:</p>
                  <p className='text-lg'>{memberDoc?.userSkiAge}</p>
                </div>
                <div className='flex gap-1'>
                  <p className='text-xl font-bold'>Snowboard Age:</p>
                  <p className='text-lg'>{memberDoc?.userSnowboardAge}</p>
                </div>
              </div>
              <div className='flex gap-1'>
                <p className='text-xl font-bold'>About me:</p>
                <p className='text-lg'>{memberDoc?.userDescription}</p>
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <button className='h-fit w-20 rounded-2xl bg-zinc-300 pl-4 pr-4 text-lg font-bold'>
                Invite
              </button>
              <button className='h-fit w-20 rounded-2xl bg-zinc-300 pl-4 pr-4 text-lg font-bold'>
                Follow
              </button>
              {/* <button className='w-20 h-fit bg-zinc-300 rounded-2xl pl-4 pr-4 text-lg font-bold'>
                Invited
              </button>
              <button className='w-20 h-fit bg-zinc-300 rounded-2xl pl-4 pr-4 text-lg font-bold'>
                Following
              </button>
              <button className='w-20 h-fit bg-zinc-300 rounded-2xl pl-4 pr-4 text-lg font-bold'>
                Friend
              </button> */}
            </div>
          </div>
        </div>
      </div>
      <div className='mb-8 w-full border border-zinc-300' />
      <div className='mb-16'>
        <p className='mb-8 text-2xl font-bold'>My Routes</p>
        <div className='flex items-center justify-center'>
          {/* <img className='h-20 w-20' src={LeftArrow} alt='Left arrow' /> */}
          <div className='grid w-fit grid-cols-4 gap-4'>
            {userCreatedRoutes &&
              userCreatedRoutes.map((doc, index) => (
                <div key={index} className='h-48 w-48 rounded-2xl bg-zinc-300'>
                  <Link
                    key={index}
                    to={`/route/${doc.routeID}`}
                    className='h-full w-full cursor-pointer rounded-2xl'
                  >
                    <p>Title: {doc.routeTitle}</p>
                    <p>User: {doc.username}</p>
                    <p>Tag: {doc.tags}</p>
                    <p>Snow Buddy: {doc.snowBuddies}</p>
                    <div className='flex gap-1'>
                      {doc.spots[0].imageUrls.map((url: string, index: number) => (
                        <img key={index} src={url} alt={`Image ${index}`} className='h-auto w-6' />
                      ))}
                    </div>
                  </Link>
                </div>
              ))}
          </div>
          {/* <img className='h-20 w-20' src={RightArrow} alt='Right arrow' /> */}
        </div>
      </div>
      <div className='mb-8 w-full border border-zinc-300' />
      <div className='mb-16'>
        <p className='mb-8 text-2xl font-bold'>My Favorite Routes</p>
        <div className='flex items-center justify-center'>
          {/* <img className='h-20 w-20' src={LeftArrow} alt='Left arrow' /> */}
          <div className='flex flex-col gap-10'>
            {userStoredLists &&
              userStoredLists.map((map, index) => (
                <div key={index}>
                  <p className='mb-2 text-2xl font-bold'>{map.listName}</p>
                  <div className='mb-6 w-full border border-zinc-300' />
                  <div className='grid w-fit grid-cols-4 gap-4'>
                    {map.routeDoc.map((doc, index) => (
                      <div key={index} className='h-48 w-48 rounded-2xl bg-zinc-300'>
                        <Link
                          key={index}
                          to={`/route/${doc.routeID}`}
                          className='h-full w-full cursor-pointer rounded-2xl'
                        >
                          <p>Title: {doc.routeTitle}</p>
                          <p>User: {doc.username}</p>
                          <p>Tag: {doc.tags}</p>
                          <p>Snow Buddy: {doc.snowBuddies}</p>
                          <div className='flex gap-1'>
                            {doc.spots[0].imageUrls.map((url: string, index: number) => (
                              <img
                                key={index}
                                src={url}
                                alt={`Image ${index}`}
                                className='h-auto w-6'
                              />
                            ))}
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>

          {/* <img className='h-20 w-20' src={RightArrow} alt='Right arrow' /> */}
        </div>
      </div>
    </div>
  )
}

export default Member
