import {
  DocumentData,
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  increment,
  onSnapshot,
  updateDoc
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../../auth/Firebase'
import { Route } from '../../store/useRoute'
import { useRouteCardStore } from '../../store/useRouteCard'
import { useUserStore } from '../../store/useUser'
import showToast from '../../utils/showToast'
import ClickedDislikeArrow from './images/clicked-dislike-arrow.png'
import ClickedLikeArrow from './images/clicked-like-arrow.png'
import UnclickedDislikeArrow from './images/unclicked-dislike-arrow.png'
import UnclickedLikeArrow from './images/unclicked-like-arrow.png'

const LikeDislike: React.FC<DocumentData> = ({ data }) => {
  const routeID = data.routeID
  const { isSignIn, userDoc } = useUserStore()
  const { likeRouteCards, setLikeRouteCards, dislikeRouteCards, setDislikeRouteCards } =
    useRouteCardStore()
  const [likeCount, setLikeCount] = useState<number>(
    data.likeUsers.length - data.dislikeUsers.length
  )
  const [swipeDirection, setSwipeDirection] = useState<string>('')

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'routes', routeID), (doc) => {
      const routeData = doc.data()
      if (routeData) {
        setLikeCount(routeData.likeCount)
      } else {
        console.error('Fail to get route data from Firestore')
      }
    })

    return () => unsubscribe()
  }, [routeID])

  const handleLikeClick = async () => {
    if (routeID && isSignIn) {
      const routeRef = doc(db, 'routes', routeID)
      const docSnap = await getDoc(routeRef)
      const routeData = docSnap.data() as Route
      if (likeRouteCards[routeID]) {
        setSwipeDirection('swipe-down')
        if (routeData?.likeUsers.includes(userDoc.userID)) {
          await updateDoc(routeRef, { likeUsers: arrayRemove(userDoc.userID) })
          await updateDoc(routeRef, { likeCount: increment(-1) })
          const newState = { ...likeRouteCards, [routeID]: false }
          setLikeRouteCards(newState)
        }
      } else {
        setSwipeDirection('swipe-up')
        if (routeData?.dislikeUsers.includes(userDoc.userID)) {
          await updateDoc(routeRef, { dislikeUsers: arrayRemove(userDoc.userID) })
          await updateDoc(routeRef, { likeCount: increment(1) })
          const newState = { ...dislikeRouteCards, [routeID]: false }
          setDislikeRouteCards(newState)
        }
        if (!routeData?.likeUsers.includes(userDoc.userID)) {
          await updateDoc(routeRef, { likeUsers: arrayUnion(userDoc.userID) })
          await updateDoc(routeRef, { likeCount: increment(1) })
          const newState = { ...likeRouteCards, [routeID]: true }
          setLikeRouteCards(newState)
        }
      }
    } else {
      showToast('warn', 'Sign in to like this route.')
    }
  }

  const handleDislikeClick = async () => {
    if (routeID && isSignIn) {
      const routeRef = doc(db, 'routes', routeID)
      const docSnap = await getDoc(routeRef)
      const routeData = docSnap.data() as Route
      if (dislikeRouteCards[routeID]) {
        setSwipeDirection('swipe-up')
        if (routeData?.dislikeUsers.includes(userDoc.userID)) {
          await updateDoc(routeRef, { dislikeUsers: arrayRemove(userDoc.userID) })
          await updateDoc(routeRef, { likeCount: increment(1) })
          const newState = { ...dislikeRouteCards, [routeID]: false }
          setDislikeRouteCards(newState)
        }
      } else {
        setSwipeDirection('swipe-down')
        if (routeData?.likeUsers.includes(userDoc.userID)) {
          await updateDoc(routeRef, { likeUsers: arrayRemove(userDoc.userID) })
          await updateDoc(routeRef, { likeCount: increment(-1) })
          const newState = { ...likeRouteCards, [routeID]: false }
          setLikeRouteCards(newState)
        }
        if (!routeData?.dislikeUsers.includes(userDoc.userID)) {
          await updateDoc(routeRef, { dislikeUsers: arrayUnion(userDoc.userID) })
          await updateDoc(routeRef, { likeCount: increment(-1) })
          const newState = { ...dislikeRouteCards, [routeID]: true }
          setDislikeRouteCards(newState)
        }
      }
    } else {
      showToast('warn', 'Sign in to dislike this route.')
    }
  }

  return (
    <div className='z-20 flex w-full flex-col items-center'>
      <p>{likeRouteCards.routeID}</p>
      <div className='h-fit w-fit cursor-pointer' onClick={() => handleLikeClick()}>
        {likeRouteCards[routeID] ? (
          <img className='h-[22px] w-4' src={ClickedLikeArrow} alt='Clicked like arrow' />
        ) : (
          <img className='h-[22px] w-4' src={UnclickedLikeArrow} alt='Unclicked like arrow' />
        )}
      </div>
      <p className={`${swipeDirection}`}>{likeCount}</p>
      <div className='h-fit w-fit cursor-pointer' onClick={() => handleDislikeClick()}>
        {dislikeRouteCards[routeID] ? (
          <img className='h-[22px] w-4' src={ClickedDislikeArrow} alt='Clicked dislike arrow' />
        ) : (
          <img className='h-[22px] w-4' src={UnclickedDislikeArrow} alt='Unclicked dislike arrow' />
        )}
      </div>
    </div>
  )
}

export default LikeDislike
