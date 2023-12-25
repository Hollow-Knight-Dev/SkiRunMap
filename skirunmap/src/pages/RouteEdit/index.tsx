import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc
} from 'firebase/firestore'
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useEffect, useRef, useState } from 'react'
import { useBlocker, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { db, storage } from '../../auth/Firebase'
import Map from '../../components/Map'
import Modal from '../../components/Modal'
import ShowOrHideArrowSVG from '../../images/ShowOrHideArrowSVG'
import UploadGpxFileSVG from '../../images/UploadGpxFileSVG'
import { MarkerWithSpotId, useMapStore } from '../../store/useMap'
import { Route, Spot, useRouteStore, useSpotStore } from '../../store/useRoute'
import { useUserStore } from '../../store/useUser'
import showToast from '../../utils/showToast'
import CrossPoles from './cross-poles.png'

const EditRoute: React.FC = () => {
  const markerIconUrl =
    'https://firebasestorage.googleapis.com/v0/b/skirunmap.appspot.com/o/google-maps-pin.png?alt=media&token=7675e200-8ab9-4c4c-b98d-12cc7c100dd0'
  const exampleGpxFileUrl =
    'https://firebasestorage.googleapis.com/v0/b/skirunmap.appspot.com/o/Kutchan.gpx?alt=media&token=9f076f2c-291d-4f6b-b3d6-85b5417ed4f3'

  const navigate = useNavigate()

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isSaveToLeave !== true && currentLocation.pathname !== nextLocation.pathname
  )

  const { userID, userDoc } = useUserStore()
  const {
    routeID,
    setRouteID,
    routeTitle,
    setRouteTitle,
    routeCoordinate,
    setRouteCoordinate,
    routeDescription,
    setRouteDescription,
    tags,
    setTags,
    tagInput,
    setTagInput,
    buddies,
    setBuddies,
    buddyInput,
    setBuddyInput,
    accessRight,
    setAccessRight,
    gpxUrl,
    setGpxUrl,
    isSaveToLeave,
    setIsSaveToLeave
  } = useRouteStore()
  const { spots, addSpot, updateSpot, removeSpot, alterSpot } = useSpotStore()
  let latestSpotsRef = useRef(spots)
  const { map, markers, addMarker, updateMarker, infoWindow, setInfoWindow, removeMarker } =
    useMapStore()
  const [gpxFileName, setGpxFileName] = useState<string>('')
  const [isDragOver, setIsDragOver] = useState<boolean>(false)
  const [routeVisibility, setRouteVisibility] = useState<boolean>(false)
  const [spotVisibility, setSpotVisibility] = useState<boolean>(false)

  useEffect(() => {
    // Need to think a way to clear all redundent data
    // handleInitialisingForm()
    console.log('routeID:', routeID)
  }, [routeID])

  useEffect(() => {
    console.log('isSaveToLeave:', isSaveToLeave)
    if (blocker.state === 'blocked' && isSaveToLeave) {
      blocker.reset()
    }
  }, [isSaveToLeave, blocker])

  useEffect(() => {
    if (!routeID) {
      const id = uuidv4()
      setRouteID(id)
    }
  }, [])

  useEffect(() => {
    if (gpxUrl) {
      setIsSaveToLeave(false)
    }
  }, [gpxUrl])

  useEffect(() => {
    latestSpotsRef.current = spots
  }, [spots])

  const toggleRouteVisibility = () => {
    setRouteVisibility((prevVisibility) => !prevVisibility)
  }
  const toggleSpotsVisibility = () => {
    setSpotVisibility((prevVisibility) => !prevVisibility)
  }

  const routesRef = ref(storage, 'routes')
  const routeRef = ref(routesRef, routeID)
  const imagesRef = ref(routeRef, 'images')
  const videosRef = ref(routeRef, 'videos')

  const handleRouteTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value
    if (title.length <= 50) {
      setRouteTitle(title)
    } else {
      setRouteTitle(title.slice(0, 50))
      showToast('warn', 'Route title exceeds 50 letters.')
    }
  }

  const handleRouteDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const description = event.target.value
    if (description.length <= 500) {
      setRouteDescription(description)
    } else {
      setRouteDescription(description.slice(0, 500))
      showToast('warn', 'Route description exceeds 500 letters.')
    }
  }

  const handleTagInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const tagTempInput = event.target.value
    if (tagTempInput.length <= 20) {
      setTagInput(tagTempInput)
    } else {
      setTagInput(tagTempInput.slice(0, 20))
      showToast('warn', 'Tag exceeds 20 letters.')
    }
  }

  const handleTagInputKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && tagInput.trim() !== '') {
      event.preventDefault()
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleTagDelete = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index)
    setTags(newTags)
  }

  const handleBuddyInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const buddyTempInput = event.target.value
    if (buddyTempInput.length <= 50) {
      setBuddyInput(buddyTempInput)
    } else {
      setBuddyInput(buddyTempInput.slice(0, 50))
      showToast('warn', 'Buddy name exceeds 50 letters.')
    }
  }

  const handleBuddyInputKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && buddyInput.trim() !== '') {
      event.preventDefault()
      setBuddies([...buddies, buddyInput.trim()])
      setBuddyInput('')
    }
  }

  const handleBuddyDelete = (index: number) => {
    const newbuddys = buddies.filter((_, i) => i !== index)
    setBuddies(newbuddys)
  }

  const handleAccessRight = (newRight: boolean) => {
    setAccessRight(newRight)
  }

  const uploadAndDownloadGpx = (file: File, fileName: string) => {
    const gpxFileRef = ref(routeRef, fileName)
    uploadBytes(gpxFileRef, file)
      .then(() => {
        return getDownloadURL(gpxFileRef)
      })
      .then((url) => {
        setGpxUrl(url)
      })
      .catch((error) => console.log('Failed to uplaod and download gpx file', error))
  }

  const handleGpxFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target
    const files: FileList | null = fileInput.files

    if (files) {
      const file: File = files[0]
      const maxSize = 500 * 1024

      if (
        file.name !== undefined &&
        file.name.toLowerCase().endsWith('.gpx') &&
        file.size <= maxSize
      ) {
        setGpxFileName(file.name)
        uploadAndDownloadGpx(file, routeID.concat('.gpx'))
      } else if (
        file.name !== undefined &&
        file.name.toLowerCase().endsWith('.gpx') &&
        file.size > maxSize
      ) {
        showToast('warn', 'GPX file size no larger than 500KB.')
      } else {
        showToast('warn', 'Invalid file type. Please upload a GPX file.')
      }
    } else {
      showToast('warn', 'Please select a GPX file.')
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files) {
      const file = files[0]

      if (file.name !== undefined && file.name.toLowerCase().endsWith('.gpx')) {
        setGpxFileName(file.name)
        uploadAndDownloadGpx(file, routeID.concat('.gpx'))
      } else {
        showToast('warn', 'Invalid file type. Please upload a GPX file.')
      }
    } else {
      showToast('warn', 'Please select a GPX file.')
    }
  }

  const handleAddSpot = () => {
    if (map && routeCoordinate.lat !== undefined && routeCoordinate.lng !== undefined) {
      const addedSpotCoordinate = { lat: routeCoordinate.lat, lng: routeCoordinate.lng }
      const id = uuidv4()
      const newSpot: Spot = {
        spotID: id,
        spotTitle: '',
        spotDescription: '',
        spotCoordinate: addedSpotCoordinate,
        imageUrls: [],
        videoUrls: []
      }
      addSpot(newSpot)
      const marker = new google.maps.Marker({
        position: addedSpotCoordinate,
        map: map,
        icon: {
          url: markerIconUrl,
          scaledSize: new google.maps.Size(36, 36)
        },
        animation: google.maps.Animation.DROP,
        draggable: true,
        title: `${id}`
      }) as MarkerWithSpotId
      marker.spotID = newSpot.spotID
      addMarker(marker)

      if (infoWindow) {
        infoWindow.close()
      }
      const markerPosition = marker.getPosition() as google.maps.LatLng
      const markercontent = JSON.stringify(markerPosition?.toJSON(), null, 2)
      const newInfoWindow = new google.maps.InfoWindow({
        content: markercontent
      })
      newInfoWindow.open(map, marker)
      setInfoWindow(newInfoWindow)
      marker.addListener('dragend', () => renewMarkerPosition(marker))
      marker.addListener('click', () => renewMarkerPosition(marker))
    } else {
      showToast('warn', 'Please upload a gpx file first.')
    }
  }

  const handleUpdateSpot = (index: number, updatedSpot: Spot) => {
    updateSpot(index, updatedSpot)
  }

  const handleRemoveSpot = (index: number) => {
    const spotIDToRemove = spots[index].spotID
    removeSpot(index)
    removeMarker(spotIDToRemove)
    const markerIndex = markers.findIndex((marker) => marker.spotID === spotIDToRemove)
    markers[markerIndex].setMap(null)
  }

  const renewMarkerPosition = (marker: MarkerWithSpotId) => {
    const markerSpotID = marker.spotID
    const markerPosition = marker.getPosition() as google.maps.LatLng
    const markercontent = JSON.stringify(markerPosition?.toJSON(), null, 2)
    const markerLat = markerPosition?.lat()
    const markerLng = markerPosition?.lng()
    marker.setPosition(new google.maps.LatLng(markerLat, markerLng))
    updateMarker(marker.spotID, marker)

    if (infoWindow) {
      infoWindow.close()
    }
    const newInfoWindow = new google.maps.InfoWindow({
      content: markercontent
    })
    newInfoWindow.open(map, marker)
    setInfoWindow(newInfoWindow)

    const addedSpotCoordinate = { lat: markerLat, lng: markerLng }
    const spotIndex = latestSpotsRef.current.findIndex((spot) => spot.spotID === markerSpotID)
    if (spotIndex !== -1) {
      alterSpot(spotIndex, { spotCoordinate: addedSpotCoordinate })
    }
  }

  const uploadAndDownloadImages = async (file: File, fileName: string, spotIndex: number) => {
    const imageRef = ref(imagesRef, fileName)
    try {
      await uploadBytes(imageRef, file)
      const url = await getDownloadURL(imageRef)
      const newUrls = [...spots[spotIndex].imageUrls, url]
      alterSpot(spotIndex, { imageUrls: newUrls })
    } catch (error) {
      console.log('Failed to uplaod and download image file', error)
    }
  }

  const handleImages = async (event: React.ChangeEvent<HTMLInputElement>, spotIndex: number) => {
    const fileInput = event.target
    const files: FileList | null = fileInput.files

    if (files) {
      const file: File = files[0]
      const maxSize = 500 * 1024

      if (file.name && file.size <= maxSize) {
        uploadAndDownloadImages(file, file.name, spotIndex)
      } else if (file.name && file.size > maxSize) {
        showToast('warn', 'Image size no larger than 500KB.')
      } else {
        showToast('warn', 'Invalid file type. Please upload jpeg, png, svg, or gif.')
      }
    }
  }

  const uploadAndDownloadVideos = async (file: File, fileName: string, spotIndex: number) => {
    const videoRef = ref(videosRef, fileName)
    try {
      await uploadBytes(videoRef, file)
      const url = await getDownloadURL(videoRef)
      const newUrls = [...spots[spotIndex].videoUrls, url]
      alterSpot(spotIndex, { videoUrls: newUrls })
    } catch (error) {
      console.log('Failed to uplaod and download mp4 file', error)
    }
  }

  const handleVideos = async (event: React.ChangeEvent<HTMLInputElement>, spotIndex: number) => {
    const fileInput = event.target
    const files: FileList | null = fileInput.files

    if (files) {
      const file: File = files[0]
      const maxSize = 1000 * 1024 // 1000KB

      if (file.name && file.size <= maxSize) {
        uploadAndDownloadVideos(file, file.name, spotIndex)
      } else if (file.name && file.size > maxSize) {
        showToast('warn', 'Video size no larger than 1000KB.')
      } else {
        showToast('warn', 'Invalid file type. Please upload a MP4 video.')
      }
    }
  }

  const handleSaveDraft = async () => {
    if (routeCoordinate.lat !== undefined && routeCoordinate.lng !== undefined) {
      const data: Route = {
        userID: userID,
        username: userDoc.username,
        routeID: routeID,
        routeTitle: routeTitle,
        gpxUrl: gpxUrl,
        routeCoordinate: { lat: routeCoordinate.lat, lng: routeCoordinate.lng },
        tags: tags,
        snowBuddies: buddies,
        spots: spots,
        isPublic: accessRight,
        isSubmitted: false,
        createTime: serverTimestamp(),
        likeUsers: [],
        dislikeUsers: [],
        likeCount: 0,
        viewCount: 0
      }
      await setDoc(doc(db, 'routes', routeID), data)

      const userRef = doc(db, 'users', userID)
      const docSnap = await getDoc(userRef)
      if (docSnap.exists()) {
        if (!docSnap.data()?.userDraftRouteIDs.includes(routeID)) {
          await updateDoc(userRef, { userDraftRouteIDs: arrayUnion(routeID) })
        }
      }
      showToast('success', 'Draft saved!')
      setIsSaveToLeave(true)
    }
  }

  const handleSubmit = async () => {
    if (routeCoordinate.lat !== undefined && routeCoordinate.lng !== undefined) {
      setIsSaveToLeave(true)
      const data: Route = {
        userID: userID,
        username: userDoc.username,
        routeID: routeID,
        routeTitle: routeTitle,
        gpxUrl: gpxUrl,
        routeCoordinate: { lat: routeCoordinate.lat, lng: routeCoordinate.lng },
        tags: tags,
        snowBuddies: buddies,
        spots: spots,
        isPublic: accessRight,
        isSubmitted: true,
        createTime: serverTimestamp(),
        likeUsers: [],
        dislikeUsers: [],
        likeCount: 0,
        viewCount: 0
      }
      await setDoc(doc(db, 'routes', routeID), data)

      const userRef = doc(db, 'users', userID)
      const docSnap = await getDoc(userRef)
      if (docSnap.exists()) {
        if (!docSnap.data()?.userRouteIDs.includes(routeID)) {
          await updateDoc(userRef, { userRouteIDs: arrayUnion(routeID) })
        }
        if (docSnap.data()?.userDraftRouteIDs.includes(routeID)) {
          await updateDoc(userRef, { userDraftRouteIDs: arrayRemove(routeID) })
        }
      }

      const keywords = [routeTitle, ...tags, ...spots.map((spot: Spot) => spot.spotTitle)]
      const kewordData = {
        routeID: routeID,
        keywords: keywords
      }
      await setDoc(doc(db, 'keywords', routeID), kewordData)
      showToast('success', 'Route submitted!', () => {
        navigate(`/member/${userDoc.userID}`)
      })
    }
  }

  const handleClearAllInputs = async () => {
    const deleteRef = ref(storage, `routes/${routeID}/${routeID}.gpx`)
    await deleteObject(deleteRef)
      .then(() => {
        console.log(`Delete route document ${routeID}.gpx in Storage successfully`)
      })
      .catch((error): void => {
        console.error('Fail to delete route document in Storage', error)
      })

    handleInitialisingForm()
  }

  const handleInitialisingForm = () => {
    setRouteID('')
    setGpxUrl('')
    setRouteCoordinate({ lat: undefined, lng: undefined })
    setRouteTitle('')
    setRouteDescription('')
    setTags([])
    setTagInput('')
    setBuddies([])
    setBuddyInput('')
    setAccessRight(true)
  }

  const handleExampleGpxUpload = () => {
    const fileLink = exampleGpxFileUrl
    fetch(fileLink)
      .then((response) => response.blob())
      .then((blob) => {
        const file = new File([blob], 'Kutchan.gpx', { type: 'application/gpx+xml' })
        uploadAndDownloadGpx(file, routeID.concat('.gpx'))
      })
  }

  const handleSpotDescription = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    spot: Spot,
    index: number
  ) => {
    const input = e.target.value
    if (input.length <= 500) {
      handleUpdateSpot(index, { ...spot, spotDescription: input })
    } else {
      handleUpdateSpot(index, { ...spot, spotDescription: input.slice(0, 500) })
      showToast('warn', 'Spot description exceeds 500 letters.')
    }
  }

  return (
    <div className='max-h-screen-contain-header relative flex w-full'>
      {blocker.state === 'blocked' ? (
        <div>
          <Modal
            title='Start Over?'
            message='If you go away now, you will lose this draft.'
            confirmTitle='Start over'
            onConfirm={() => {
              handleClearAllInputs()
              blocker.proceed()
            }}
            middleTitle='Save draft'
            onMiddleOption={() => {
              blocker.reset()
              handleSaveDraft()
            }}
            cancelTitle='Keep editing'
            onCancel={() => blocker.reset()}
          />
          <div className='h-screen-64px absolute z-10 w-screen bg-zinc-600 opacity-60'></div>
        </div>
      ) : null}
      <div className='h-screen-64px flex w-full'>
        <div className='h-full w-2/3 bg-zinc-100'>
          {gpxUrl ? (
            <Map gpxUrl={gpxUrl} createMode={true} />
          ) : (
            <div className='h-full w-full p-4'>
              <div
                className={`flex h-full w-full flex-col items-center justify-center rounded-lg border-2 border-dashed ${
                  isDragOver ? 'border-zinc-400 bg-zinc-100' : 'border-zinc-600 bg-zinc-200'
                }`}
                onDragOver={(e) => handleDragOver(e)}
                onDragLeave={(e) => handleDragLeave(e)}
                onDrop={(e) => handleDrop(e)}
              >
                <div
                  className={`flex items-center rounded-2xl bg-zinc-100 pl-2 text-lg font-bold hover:bg-zinc-300 ${
                    isDragOver && 'text-zinc-300'
                  }`}
                >
                  <UploadGpxFileSVG />
                  <label htmlFor='gpxFile' className='cursor-pointer rounded-l-2xl pl-2'>
                    Drag GPX file or&nbsp;
                  </label>
                  <label
                    htmlFor='gpxFile'
                    className='cursor-pointer rounded-r-2xl pr-4 underline underline-offset-2'
                  >
                    Click to browse file
                  </label>
                  <input
                    className='hidden'
                    type='file'
                    id='gpxFile'
                    onChange={handleGpxFile}
                    accept='.gpx'
                  />
                </div>
                <p
                  className='button-shadow mt-8 cursor-pointer rounded-xl bg-blue-100 pl-4 pr-4 underline underline-offset-2 hover:bg-blue-200'
                  onClick={() => handleExampleGpxUpload()}
                >
                  Use example file
                </p>
              </div>
            </div>
          )}
        </div>
        <form className='flex h-full w-1/3 flex-col justify-between overflow-x-hidden overflow-y-scroll bg-blue-100 p-4'>
          <div className='flex flex-col gap-2 p-2'>
            {gpxUrl && (
              <div className='mb-4 flex items-center gap-2'>
                <label
                  htmlFor='gpxFile'
                  className='button-shadow w-fit cursor-pointer rounded-2xl bg-blue-200 pl-4 pr-4 text-lg font-bold hover:bg-zinc-300'
                >
                  Alter GPX file
                </label>
                <input
                  className='hidden'
                  type='file'
                  id='gpxFile'
                  onChange={handleGpxFile}
                  accept='.gpx'
                />
                {gpxFileName && <p>{gpxFileName}</p>}
              </div>
            )}

            <div
              className='flex h-12 w-full cursor-pointer flex-wrap items-center justify-between'
              onClick={() => toggleRouteVisibility()}
            >
              <p className='text-3xl font-bold'>Route</p>
              <ShowOrHideArrowSVG isShown={routeVisibility} />
              <div className='w-full border border-blue-400' />
            </div>

            <div className={`mb-4 flex flex-col gap-4 ${!routeVisibility && 'hidden'}`}>
              <div className='flex flex-col'>
                <label className='w-40 text-lg font-bold'>Route Title:</label>
                <input
                  type='text'
                  value={routeTitle}
                  onChange={(event) => {
                    handleRouteTitle(event)
                  }}
                  className='nice-shadow h-10 p-2'
                />
              </div>

              <div className='flex flex-col'>
                <div className='flex items-center'>
                  <p className='w-40 text-lg font-bold'>Route Coordinate:</p>
                </div>
                <div className='flex flex-col gap-1'>
                  <div className='ml-16 flex items-center'>
                    <label className='w-28 text-lg'>Latitude:</label>
                    <input
                      type='number'
                      value={routeCoordinate.lat ?? ''}
                      className='h-10 p-2 text-zinc-400'
                      readOnly
                    />
                  </div>
                  <div className='ml-16 flex items-center'>
                    <label className='w-28 text-lg'>Longitude:</label>
                    <input
                      type='number'
                      value={routeCoordinate.lng ?? ''}
                      className='h-10 p-2 text-zinc-400'
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className='flex flex-col'>
                <label className='text-lg font-bold'>Route Description:</label>
                <textarea
                  className='nice-shadow h-fit w-full resize-none p-2'
                  placeholder='Add route description'
                  value={routeDescription}
                  onChange={(event) => handleRouteDescription(event)}
                />
              </div>

              {/* <div className='flex flex-col'>
                <label className='w-40 text-lg font-bold'>Date:</label>
              <input type='text' className='h-10 p-2' />
              </div> */}

              <div className='flex flex-col'>
                <label className='text-lg font-bold'>Tag this route:</label>
                <div className='mb-2 flex gap-2'>
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className='flex h-auto w-fit cursor-pointer items-center gap-1 rounded-md bg-blue-200 pl-2 pr-2 text-sm'
                      onClick={() => handleTagDelete(index)}
                    >
                      {tag}
                      <img src={CrossPoles} alt='Cross sign' className='h-4 w-auto' />
                    </span>
                  ))}
                </div>
                <textarea
                  className='nice-shadow h-10 w-full resize-none p-2'
                  placeholder='Press Enter to add tag ex. niseko, gondola, the-best-lift'
                  onChange={(event) => handleTagInput(event)}
                  onKeyDown={handleTagInputKeyDown}
                  value={tagInput}
                />
              </div>

              <div className='flex flex-col'>
                <label className='text-lg font-bold'>Tag snow buddy:</label>
                <div className='mb-2 flex gap-2'>
                  {buddies.map((buddy, index) => (
                    <span
                      key={index}
                      className='flex h-auto w-fit cursor-pointer items-center gap-1 rounded-md bg-blue-200 pl-2 pr-2 text-sm'
                      onClick={() => handleBuddyDelete(index)}
                    >
                      {buddy}
                      <img src={CrossPoles} alt='Cross sign' className='h-4 w-auto' />
                    </span>
                  ))}
                </div>
                <textarea
                  className='nice-shadow h-10 w-full resize-none p-2'
                  placeholder='Press Enter to tag snow buddy with this route'
                  onChange={(event) => handleBuddyInput(event)}
                  onKeyDown={handleBuddyInputKeyDown}
                  value={buddyInput}
                />
              </div>

              <div className='flex flex-col'>
                <p className='w-40 text-lg font-bold'>Set Access Right:</p>
                <div className='flex gap-4'>
                  <div
                    className={`button-shadow w-16 cursor-pointer rounded-md text-center ${
                      accessRight === true ? 'bg-blue-300' : 'bg-white'
                    }`}
                    onClick={() => handleAccessRight(true)}
                  >
                    Public
                  </div>
                  <div
                    className={`button-shadow w-16 cursor-pointer rounded-md text-center ${
                      accessRight === false ? 'bg-blue-300' : 'bg-white'
                    }`}
                    onClick={() => handleAccessRight(false)}
                  >
                    Private
                  </div>
                </div>
              </div>
            </div>

            <div
              className='mb-2 flex h-12 w-full cursor-pointer flex-wrap items-center justify-between'
              onClick={() => toggleSpotsVisibility()}
            >
              <p className='text-3xl font-bold'>Spots</p>
              <ShowOrHideArrowSVG isShown={spotVisibility} />
              <div className='w-full border border-blue-400' />
            </div>

            <div className={`mb-4 flex flex-col gap-4 ${!spotVisibility && 'hidden'}`}>
              {spots.map((spot, index) => (
                <div key={index} className='flex flex-col gap-4'>
                  <div className='flex items-center justify-between'>
                    <p className='w-full text-lg font-bold underline'>{`Spot ${index + 1}`}</p>
                    <p
                      className='button-shadow cursor-pointer rounded-md bg-blue-200 pl-2 pr-2 text-sm hover:bg-red-200'
                      onClick={() => handleRemoveSpot(index)}
                    >
                      Delete
                    </p>
                  </div>

                  <div className='flex flex-col'>
                    <label className='w-40 text-lg font-bold'>Spot Title:</label>
                    <input
                      type='text'
                      value={spot.spotTitle}
                      onChange={(event) => {
                        handleUpdateSpot(index, { ...spot, spotTitle: event.target.value })
                      }}
                      className='nice-shadow h-10 p-2'
                    />
                  </div>

                  <div className='flex flex-col'>
                    <div className='flex items-center'>
                      <p className='w-40 text-lg font-bold'>Spot Coordinate:</p>
                    </div>

                    <div className='flex flex-col gap-1'>
                      <div className='ml-16 flex items-center'>
                        <label className='w-28 text-lg'>Latitude:</label>
                        <input
                          type='number'
                          value={spot.spotCoordinate.lat}
                          className='h-10 p-2 text-zinc-400'
                          readOnly
                        />
                      </div>
                      <div className='ml-16 flex items-center'>
                        <label className='w-28 text-lg'>Longitude:</label>
                        <input
                          type='number'
                          value={spot.spotCoordinate.lng}
                          className='h-10 p-2 text-zinc-400'
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  <div className='flex flex-col'>
                    <label className='text-lg font-bold'>Spot Description:</label>
                    <textarea
                      className='nice-shadow h-fit w-full resize-none p-2'
                      placeholder='Add spot description'
                      value={spot.spotDescription}
                      onChange={(e) => handleSpotDescription(e, spot, index)}
                    />
                  </div>

                  <div className='flex flex-col'>
                    <div className='flex w-full flex-wrap items-center gap-2'>
                      <label
                        htmlFor={`imageFile${index}`}
                        className='button-shadow flex h-28 w-28 cursor-pointer items-center justify-center rounded-2xl bg-blue-200 pl-4 pr-4 text-lg font-bold'
                      >
                        + Images
                      </label>
                      <input
                        className='hidden'
                        type='file'
                        id={`imageFile${index}`}
                        accept='image/jpeg, image/png, image/svg+xml, image/gif'
                        onChange={(event) => handleImages(event, index)}
                      />
                      {spot.imageUrls.map((url, i) => (
                        <div className='flex h-28 w-28 items-center rounded-2xl border border-dashed border-zinc-400'>
                          <img
                            key={i}
                            src={url}
                            alt={`Image ${i}`}
                            className='h-auto w-full object-cover p-2'
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className='flex flex-col'>
                    <div className='flex w-full flex-wrap items-center gap-2'>
                      <label
                        htmlFor={`videoFile${index}`}
                        className='button-shadow flex h-28 w-28 cursor-pointer items-center justify-center rounded-2xl bg-blue-200 pl-4 pr-4 text-lg font-bold'
                      >
                        + Videos
                      </label>
                      <input
                        className='hidden'
                        type='file'
                        id={`videoFile${index}`}
                        accept='video/mp4'
                        onChange={(event) => handleVideos(event, index)}
                      />
                      {spot.videoUrls.map((url, i) => (
                        <div className='flex h-28 w-28 items-center rounded-2xl border border-dashed border-zinc-400'>
                          <video key={i} controls width='112' height='84'>
                            <source src={url} type='video/mp4' />
                          </video>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <div
                className='nice-shadow mt-4 h-fit w-full cursor-pointer rounded-2xl bg-blue-500 pl-4 pr-4 text-center text-lg font-bold text-white'
                onClick={() => handleAddSpot()}
              >
                Add new spot
              </div>
            </div>
          </div>

          <div className='mt-8 flex justify-between'>
            <div
              className='button-shadow h-fit w-fit cursor-pointer rounded-3xl bg-blue-300 p-4 text-xl font-bold text-white hover:text-black'
              onClick={() => handleSaveDraft()}
            >
              Save draft
            </div>
            <div
              className='button-shadow h-fit w-fit cursor-pointer rounded-3xl bg-blue-300 p-4 text-xl font-bold text-white hover:text-black'
              onClick={() => handleSubmit()}
            >
              Submit route
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditRoute
