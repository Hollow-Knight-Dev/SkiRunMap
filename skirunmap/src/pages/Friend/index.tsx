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
import { db } from '../../auth/Firebase'
import { useUserStore } from '../../store/useUser'
import { NavItem } from './NavItem'
import { UserList, UserListProps } from './UserList'

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
  const [filter, setFilter] = useState<string>('Following')

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

  const handleFilter = (filter: string) => {
    setFilter(filter)
  }

  const navItemOptions = [
    { navItemName: 'Following', img: 'ski' },
    { navItemName: 'Followers', img: 'snowboard' },
    { navItemName: 'Friends', img: 'ski' },
    { navItemName: 'Friend Requests', img: 'snowboard' },
    { navItemName: 'Sent Invitations', img: 'ski' }
  ]

  const userListContent: { [key: string]: UserListProps } = {
    Following: {
      list: followList,
      navItemTitle: 'Following',
      mainBtnName: 'Unfollow',
      mainBtnOnClick: (userID: string) => handleUnfollowFollows(userID)
    },
    Followers: {
      list: followerList,
      navItemTitle: 'Followers',
      mainBtnName: 'Remove',
      mainBtnOnClick: (userID: string) => handleRemoveFollowers(userID)
    },
    Friends: {
      list: friendList,
      navItemTitle: 'Friends',
      mainBtnName: 'Break up',
      mainBtnOnClick: (userID: string) => handleBreakUpFriends(userID)
    },
    'Friend Requests': {
      list: friendReqList,
      navItemTitle: 'Friend Requests',
      firstBtnName: 'Accept',
      firstBtnOnClick: (userID: string) => handleAcceptFriendReqs(userID),
      mainBtnName: 'Reject',
      mainBtnOnClick: (userID: string) => handleRejectFriendReqs(userID)
    },
    'Sent Invitations': {
      list: sentFriendReqList,
      navItemTitle: 'Sent Invitations',
      mainBtnName: 'Withdraw',
      mainBtnOnClick: (userID: string) => handleWithdrawSentFriendReqs(userID)
    }
  }

  return (
    <div className='h-screen-64px flex justify-center'>
      <div className='min-w-64 m-8 h-fit rounded-xl border border-zinc-200 p-4 shadow-[0px_0px_10px_-6px_#555555]'>
        <p className='mb-4 text-2xl font-bold'>User management</p>
        <div className='flex flex-col text-xl'>
          {navItemOptions.map(({ navItemName, img }) => (
            <NavItem
              key={navItemName}
              filter={filter}
              navItemName={navItemName}
              img={img}
              onClick={() => handleFilter(navItemName)}
            />
          ))}
        </div>
      </div>
      <div className='m-8 flex w-[500px] flex-col pt-4'>
        {/* <div className='relative mb-8 w-2/3 self-end'>
          <img className='absolute left-4 top-2 w-7' src={SearchIcon} alt='Search Icon' />
          <input
            className='w-full rounded-3xl border border-zinc-300 p-2 pl-16'
            placeholder='Search user by username'
          />
        </div> */}
        {filter && <UserList {...userListContent[filter]} />}
      </div>
    </div>
  )
}

export default Friends
