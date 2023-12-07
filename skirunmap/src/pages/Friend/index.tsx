import { arrayRemove, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { db } from '../../auth/CloudStorage'
import { useUserStore } from '../../store/useUser'
import ProfileIcon from './User-icon.png'
import SearchIcon from './search-icon.png'

interface UserSimpleData {
  userID: string
  username: string
  userIconUrl: string
}

const Friends = () => {
  const navigate = useNavigate()
  const { isSignIn, userDoc, isLoadedUserDoc } = useUserStore()
  const [followList, setFollowList] = useState<UserSimpleData[]>()
  const [followerList, setFollowerList] = useState<UserSimpleData[]>()
  const [friendList, setFriendList] = useState<UserSimpleData[]>()

  useEffect(() => {
    if (isLoadedUserDoc && !isSignIn) {
      toast.warn('Please sign in to view your friends', {
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
    }
  }, [userDoc])

  const retrieveUserSimpleData = async (list: string[]) => {
    if (list.length > 0) {
      const userQuery = query(collection(db, 'users'), where('userID', 'in', list))
      const userDocsSnapshot = await getDocs(userQuery)
      const userSimpleData = userDocsSnapshot.docs.map((doc) => {
        const { userID, username, userIconUrl } = doc.data()
        return { userID, username, userIconUrl }
      })
      return userSimpleData
    }
  }

  const retrieveFollows = async (list: string[]) => {
    const followsData = await retrieveUserSimpleData(list)
    setFollowList(followsData)
  }

  const retrieveFollowers = async (list: string[]) => {
    const followersData = await retrieveUserSimpleData(list)
    setFollowerList(followersData)
  }

  const retrieveFriends = async (list: string[]) => {
    const friendsData = await retrieveUserSimpleData(list)
    setFriendList(friendsData)
  }

  useEffect(() => {
    if (isLoadedUserDoc) {
      const userFollowList = userDoc.userFollows
      retrieveFollows(userFollowList)
    }
  }, [userDoc])

  useEffect(() => {
    if (isLoadedUserDoc) {
      const userFollowersList = userDoc.userFollowers
      retrieveFollowers(userFollowersList)
    }
  }, [userDoc])

  useEffect(() => {
    if (isLoadedUserDoc) {
      const userFriendList = userDoc.userFriends
      retrieveFriends(userFriendList)
    }
  }, [userDoc])

  useEffect(() => {
    console.log('friendList:', friendList)
  }, [friendList])

  useEffect(() => {
    if (isLoadedUserDoc) {
      const userFriendReqList = userDoc.userFriendReqs
    }
  }, [userDoc])

  useEffect(() => {
    if (isLoadedUserDoc) {
      const userFriendSentReqList = userDoc.userSentFriendReqs
    }
  }, [userDoc])

  const handleUnfollowFollows = async (id: string) => {
    const myUserRef = doc(db, 'users', userDoc.userID)
    const otherUserRef = doc(db, 'users', id)
    await updateDoc(myUserRef, { userFollows: arrayRemove(id) })
    await updateDoc(otherUserRef, { userFollowers: arrayRemove(userDoc.userID) })
    const updateFollowList = followList?.filter((user) => user.userID !== id)
    setFollowList(updateFollowList)
  }

  const handleRemoveFollowers = async (id: string) => {
    const myUserRef = doc(db, 'users', userDoc.userID)
    const otherUserRef = doc(db, 'users', id)
    await updateDoc(myUserRef, { userFollowers: arrayRemove(id) })
    await updateDoc(otherUserRef, { userFollows: arrayRemove(userDoc.userID) })
    const updateFollowerList = followerList?.filter((user) => user.userID !== id)
    setFollowerList(updateFollowerList)
  }

  const handleBreakUpFriends = async (id: string) => {
    console.log('Break up with friend')
    const myUserRef = doc(db, 'users', userDoc.userID)
    const otherUserRef = doc(db, 'users', id)
    await updateDoc(myUserRef, { userFriends: arrayRemove(id) })
    await updateDoc(otherUserRef, { userFriends: arrayRemove(userDoc.userID) })
    const updateFriendList = friendList?.filter((user) => user.userID !== id)
    setFriendList(updateFriendList)
  }

  return (
    <div className='flex flex-col p-8'>
      <div className='relative mb-8 w-1/3 self-end'>
        <img className='absolute left-4 top-2 w-7' src={SearchIcon} alt='Search Icon' />
        <input
          className='w-full rounded-3xl border border-zinc-300 p-2 pl-16'
          placeholder='Search user by username'
        />
      </div>
      <div className='mb-16'>
        <p className='mb-4 text-2xl font-bold'>Following</p>
        <div className='mb-8 w-full border border-zinc-300' />
        <div className='flex flex-col gap-4'>
          {followList &&
            followList.map((user, index) => (
              <div key={index} className='flex items-center justify-between'>
                <Link to={`/member/${user.userID}`} className='flex items-center gap-4'>
                  <img
                    className='h-20 w-20 rounded-full object-cover'
                    src={user.userIconUrl}
                    alt='Friend Profile Icon'
                  />
                  <p className='text-xl'>{user.username}</p>
                </Link>
                <button
                  className='h-10 w-20 rounded-xl bg-zinc-100 hover:bg-zinc-300'
                  onClick={() => handleUnfollowFollows(user.userID)}
                >
                  Unfollow
                </button>
              </div>
            ))}
        </div>
      </div>
      <div className='mb-16'>
        <p className='mb-4 text-2xl font-bold'>Followers</p>
        <div className='mb-8 w-full border border-zinc-300' />
        <div className='flex flex-col gap-4'>
          {followerList &&
            followerList.map((user, index) => (
              <div key={index} className='flex items-center justify-between'>
                <Link to={`/member/${user.userID}`} className='flex items-center gap-4'>
                  <img
                    className='h-20 w-20 rounded-full object-cover'
                    src={user.userIconUrl}
                    alt='Friend Profile Icon'
                  />
                  <p className='text-xl'>{user.username}</p>
                </Link>
                <button
                  className='h-10 w-20 rounded-xl bg-zinc-100 hover:bg-zinc-300'
                  onClick={() => handleRemoveFollowers(user.userID)}
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
      </div>
      <div className='mb-16'>
        <p className='mb-4 text-2xl font-bold'>My Friend</p>
        <div className='mb-8 w-full border border-zinc-300' />
        <div className='flex flex-col gap-4'>
          {friendList &&
            friendList.map((user, index) => (
              <div key={index} className='flex items-center justify-between'>
                <Link to={`/member/${user.userID}`} className='flex items-center gap-4'>
                  <img
                    className='h-20 w-20 rounded-full object-cover'
                    src={user.userIconUrl}
                    alt='Friend Profile Icon'
                  />
                  <p className='text-xl'>{user.username}</p>
                </Link>
                <button
                  className='h-10 w-20 rounded-xl bg-zinc-100 hover:bg-zinc-300'
                  onClick={() => handleBreakUpFriends(user.userID)}
                >
                  Break up
                </button>
              </div>
            ))}
        </div>
      </div>
      <div className='mb-16'>
        <p className='mb-4 text-2xl font-bold'>Friend Request</p>
        <div className='mb-8 w-full border border-zinc-300' />
        <div className='flex items-center justify-center'>
          <div className='flex items-center'>
            <img className='h-20 w-20' src={ProfileIcon} alt='Friend Profile Icon' />
            <p className='w-40 bg-zinc-100 text-center'>I Am Not Groot</p>
          </div>
        </div>
      </div>
      <div className='mb-16'>
        <p className='mb-4 text-2xl font-bold'>Sent Invitation</p>
        <div className='mb-8 w-full border border-zinc-300' />
        <div className='flex items-center justify-center'>
          <div className='flex items-center'>
            <img className='h-20 w-20' src={ProfileIcon} alt='Friend Profile Icon' />
            <p className='w-40 bg-zinc-100 text-center'>I Am Not Groot</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Friends
