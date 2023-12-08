import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../../auth/CloudStorage'
import { useUserStore } from '../../store/useUser'
import SearchIcon from './search-icon.png'

interface UserSimpleData {
  userID: string
  username: string
  userIconUrl: string
}

const Friends = () => {
  const { userDoc, isLoadedUserDoc } = useUserStore()
  const [followList, setFollowList] = useState<UserSimpleData[]>()
  const [followerList, setFollowerList] = useState<UserSimpleData[]>()
  const [friendList, setFriendList] = useState<UserSimpleData[]>()
  const [friendReqList, setFriendReqList] = useState<UserSimpleData[]>()
  const [sentFriendReqList, setSentFriendReqList] = useState<UserSimpleData[]>()

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

  const retrieveFriendReqs = async (list: string[]) => {
    const friendReqData = await retrieveUserSimpleData(list)
    setFriendReqList(friendReqData)
  }

  const retrieveSentFriendReqs = async (list: string[]) => {
    const sentFriendReqData = await retrieveUserSimpleData(list)
    setSentFriendReqList(sentFriendReqData)
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
    if (isLoadedUserDoc) {
      const userFriendReqList = userDoc.userFriendReqs
      retrieveFriendReqs(userFriendReqList)
    }
  }, [userDoc])

  useEffect(() => {
    if (isLoadedUserDoc) {
      const userFriendSentReqList = userDoc.userSentFriendReqs
      retrieveSentFriendReqs(userFriendSentReqList)
    }
  }, [userDoc])

  useEffect(() => {
    console.log('sentFriendReqList:', sentFriendReqList)
  }, [sentFriendReqList])

  const handleUnfollowFollows = async (id: string) => {
    const myUserRef = doc(db, 'users', userDoc.userID)
    const otherUserRef = doc(db, 'users', id)
    await updateDoc(myUserRef, { userFollows: arrayRemove(id) })
    await updateDoc(otherUserRef, { userFollowers: arrayRemove(userDoc.userID) })
    const updateList = followList?.filter((user) => user.userID !== id)
    setFollowList(updateList)
  }

  const handleRemoveFollowers = async (id: string) => {
    const myUserRef = doc(db, 'users', userDoc.userID)
    const otherUserRef = doc(db, 'users', id)
    await updateDoc(myUserRef, { userFollowers: arrayRemove(id) })
    await updateDoc(otherUserRef, { userFollows: arrayRemove(userDoc.userID) })
    const updateList = followerList?.filter((user) => user.userID !== id)
    setFollowerList(updateList)
  }

  const handleBreakUpFriends = async (id: string) => {
    const myUserRef = doc(db, 'users', userDoc.userID)
    const otherUserRef = doc(db, 'users', id)
    await updateDoc(myUserRef, { userFriends: arrayRemove(id) })
    await updateDoc(otherUserRef, { userFriends: arrayRemove(userDoc.userID) })
    const updateList = friendList?.filter((user) => user.userID !== id)
    setFriendList(updateList)
  }

  const handleAcceptFriendReqs = async (id: string) => {
    const myUserRef = doc(db, 'users', userDoc.userID)
    const otherUserRef = doc(db, 'users', id)
    await updateDoc(myUserRef, { userFriends: arrayUnion(id) })
    await updateDoc(myUserRef, { userFriendReqs: arrayRemove(id) })
    await updateDoc(otherUserRef, { userFriends: arrayUnion(userDoc.userID) })
    await updateDoc(otherUserRef, { userSentFriendReqs: arrayRemove(userDoc.userID) })
    const updateFriendReqList = friendReqList?.filter((user) => user.userID !== id)
    setFriendReqList(updateFriendReqList)
    const otherUserData = friendReqList?.find((user) => user.userID === id)
    if (friendList && otherUserData) {
      const updateList = [...friendList, otherUserData]
      setFriendList(updateList)
    } else if (otherUserData) {
      const updateList = [otherUserData]
      setFriendList(updateList)
    }
  }

  const handleRejectFriendReqs = async (id: string) => {
    const myUserRef = doc(db, 'users', userDoc.userID)
    const otherUserRef = doc(db, 'users', id)
    await updateDoc(myUserRef, { userFriendReqs: arrayRemove(id) })
    await updateDoc(otherUserRef, { userSentFriendReqs: arrayRemove(userDoc.userID) })
    const updateList = friendReqList?.filter((user) => user.userID !== id)
    setFriendReqList(updateList)
  }

  const handleWithdrawSentFriendReqs = async (id: string) => {
    console.log('Withdraw Sent Friend Reqs')
    const myUserRef = doc(db, 'users', userDoc.userID)
    const otherUserRef = doc(db, 'users', id)
    await updateDoc(myUserRef, { userSentFriendReqs: arrayRemove(id) })
    await updateDoc(otherUserRef, { userFriendReqs: arrayRemove(userDoc.userID) })
    const updateList = sentFriendReqList?.filter((user) => user.userID !== id)
    setSentFriendReqList(updateList)
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
                  className='h-10 w-20 rounded-xl bg-zinc-100 hover:bg-red-200'
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
                  className='h-10 w-20 rounded-xl bg-zinc-100 hover:bg-red-200'
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
                  className='h-10 w-20 rounded-xl bg-zinc-100 hover:bg-red-200'
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
        <div className='flex flex-col gap-4'>
          {friendReqList &&
            friendReqList.map((user, index) => (
              <div key={index} className='flex items-center justify-between'>
                <Link to={`/member/${user.userID}`} className='flex items-center gap-4'>
                  <img
                    className='h-20 w-20 rounded-full object-cover'
                    src={user.userIconUrl}
                    alt='Friend Profile Icon'
                  />
                  <p className='text-xl'>{user.username}</p>
                </Link>
                <div className='flex gap-4'>
                  <button
                    className='h-10 w-20 rounded-xl bg-zinc-100 hover:bg-green-200'
                    onClick={() => handleAcceptFriendReqs(user.userID)}
                  >
                    Accept
                  </button>
                  <button
                    className='h-10 w-20 rounded-xl bg-zinc-100 hover:bg-red-200'
                    onClick={() => handleRejectFriendReqs(user.userID)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className='mb-16'>
        <p className='mb-4 text-2xl font-bold'>Sent Invitation</p>
        <div className='mb-8 w-full border border-zinc-300' />
        <div className='flex flex-col gap-4'>
          {sentFriendReqList &&
            sentFriendReqList.map((user, index) => (
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
                  className='h-10 w-20 rounded-xl bg-zinc-100 hover:bg-red-200'
                  onClick={() => handleWithdrawSentFriendReqs(user.userID)}
                >
                  Withdraw
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Friends
