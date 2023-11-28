import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { v4 as uuidv4 } from 'uuid'
import { db, storage } from '../../auth/CloudStorage'
import Map from '../../components/Map'
import {
  Route,
  Spot,
  useAccessRight,
  useBuddies,
  useBuddyInput,
  useGpxUrl,
  // useImageUrls,
  useRouteDescription,
  useRouteID,
  useRouteTitle,
  // useSpotDescription,
  useSpotStore,
  // useSpotTitle,
  useTagInput,
  useTags
} from '../../store/useRoute'
import { useUserID } from '../../store/useUser'
import HideArrow from './hide_arrow.png'
import ShowArrow from './show_arrow.png'

const EditRoute: React.FC = () => {
  const navigate = useNavigate()
  const userID = useUserID((state) => state.userID)
  const routeID = useRouteID((state) => state.routeID)
  const setRouteID = useRouteID((state) => state.setRouteID)
  const routeTitle = useRouteTitle((state) => state.routeTitle)
  const setRouteTitle = useRouteTitle((state) => state.setRouteTitle)
  const routeDescription = useRouteDescription((state) => state.routeDescription)
  const setRouteDescription = useRouteDescription((state) => state.setRouteDescription)
  // const spotTitle = useSpotTitle((state) => state.spotTitle)
  // const setSpotTitle = useSpotTitle((state) => state.setSpotTitle)
  // const spotDescription = useSpotDescription((state) => state.spotDescription)
  // const setSpotDescription = useSpotDescription((state) => state.setSpotDescription)
  const tags = useTags((state) => state.tags)
  const setTags = useTags((state) => state.setTags)
  const tagInput = useTagInput((state) => state.tagInput)
  const setTagInput = useTagInput((state) => state.setTagInput)
  const buddies = useBuddies((state) => state.buddies)
  const setBuddies = useBuddies((state) => state.setBuddies)
  const buddyInput = useBuddyInput((state) => state.buddyInput)
  const setBuddyInput = useBuddyInput((state) => state.setBuddyInput)
  const accessRight = useAccessRight((state) => state.accessRight)
  const setAccessRight = useAccessRight((state) => state.setAccessRight)
  const gpxUrl = useGpxUrl((state) => state.gpxUrl)
  const setGpxUrl = useGpxUrl((state) => state.setGpxUrl)
  // const imageUrls = useImageUrls((state) => state.imageUrls)
  // const setImageUrls = useImageUrls((state) => state.setImageUrls)
  // const videoUrls = useVideoUrls((state) => state.videoUrls)
  // const setVideoUrls = useVideoUrls((state) => state.setVideoUrls)
  const { spots, addSpot, updateSpot, removeSpot, alterSpot } = useSpotStore()
  const [gpxFileName, setGpxFileName] = useState<string>('')
  const [isDragOver, setIsDragOver] = useState<boolean>(false)
  const [routeVisibility, setRouteVisibility] = useState<boolean>(false)
  const [spotVisibility, setSpotVisibility] = useState<boolean>(false)

  const toggleRouteVisibility = () => {
    setRouteVisibility((prevVisibility) => !prevVisibility)
  }
  const toggleSpotVisibility = () => {
    setSpotVisibility((prevVisibility) => !prevVisibility)
  }

  const routesRef = ref(storage, 'routes')
  const routeRef = ref(routesRef, routeID)
  const imagesRef = ref(routeRef, 'images')
  const videosRef = ref(routeRef, 'videos')

  const handleRouteTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value
    if (title.length <= 30) {
      setRouteTitle(title)
    } else {
      alert('Route title exceeds letter limitation')
      setRouteTitle(title.slice(0, 30))
    }
  }

  const handleRouteDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const description = event.target.value
    if (description.length <= 50) {
      setRouteDescription(description)
    } else {
      alert('Route description exceeds letter limitation')
      setRouteDescription(description.slice(0, 50))
    }
  }

  const handleTagInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const tagTempInput = event.target.value
    if (tagTempInput.length <= 20) {
      setTagInput(tagTempInput)
    } else {
      alert('Tag name exceeds letter limitation')
      setTagInput(tagTempInput.slice(0, 20))
    }
  }

  const handleTagInputKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && tagInput.trim() !== '') {
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
    if (buddyTempInput.length <= 20) {
      setBuddyInput(buddyTempInput)
    } else {
      alert('Buddy name exceeds letter limitation')
      setBuddyInput(buddyTempInput.slice(0, 20))
    }
  }

  const handleBuddyInputKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && buddyInput.trim() !== '') {
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
      if (file.name !== undefined && file.name.toLowerCase().endsWith('.gpx')) {
        setGpxFileName(file.name)
        uploadAndDownloadGpx(file, routeID.concat('.gpx'))
      } else {
        alert('Invalid file type. Please upload a GPX file.')
      }
    } else {
      alert('Please select a GPX file.')
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
        alert('Invalid file type. Please upload a GPX file.')
      }
    } else {
      alert('Please select a GPX file.')
    }
  }

  const handleAddSpot = () => {
    const newSpot: Spot = {
      spotTitle: '',
      spotDescription: '',
      spotCoordinate: { lat: 42.84676617984929, lng: 140.68491306976668 },
      imageUrls: [],
      videoUrls: []
    }
    addSpot(newSpot)
  }

  const handleUpdateSpot = (index: number, updatedSpot: Spot) => {
    updateSpot(index, updatedSpot)
  }

  const handleRemoveSpot = (index: number) => {
    removeSpot(index)
  }

  // const handleSpotTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const title = event.target.value
  //   if (title.length <= 30) {
  //     setSpotTitle(title)
  //   } else {
  //     alert('Spot title exceeds letter limitation')
  //     setSpotTitle(title.slice(0, 30))
  //   }
  // }

  // const handleSpotDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   const description = event.target.value
  //   if (description.length <= 50) {
  //     setSpotDescription(description)
  //   } else {
  //     alert('Spot description exceeds letter limitation')
  //     setSpotDescription(description.slice(0, 50))
  //   }
  // }

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
      if (file.name) {
        uploadAndDownloadImages(file, file.name, spotIndex)
      } else {
        alert('Invalid file type. Please upload an image.')
      }
    } else {
      alert('Please select an image.')
      return
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
      if (file.name) {
        uploadAndDownloadVideos(file, file.name, spotIndex)
      } else {
        alert('Invalid file type. Please upload an MP4 video.')
      }
    } else {
      alert('Please select an MP4 video.')
      return
    }
  }

  const handleSaveDraft = async () => {
    const data: Route = {
      userID: userID,
      username: 'I Am Groot',
      routeID: routeID,
      routeTitle: routeTitle,
      gpxUrl: gpxUrl,
      routeCoordinate: { lat: 42.827069873533766, lng: 140.80677808428817 },
      tags: tags,
      snowBuddies: buddies,
      spots: spots,
      isPublic: accessRight,
      isSubmitted: false,
      createTime: serverTimestamp(),
      likeUsers: ['2', '3', '4'],
      dislikeUsers: ['5'],
      likeCount: 2,
      viewCount: 1000,
      comments: []
    }
    await setDoc(doc(db, 'routes', routeID), data).then(() =>
      toast.success('Draft saved!', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'light'
      })
    )
  }

  const handleSubmit = async () => {
    const data: Route = {
      userID: userID,
      username: 'I Am Groot',
      routeID: routeID,
      routeTitle: routeTitle,
      gpxUrl: gpxUrl,
      routeCoordinate: { lat: 42.827069873533766, lng: 140.80677808428817 },
      tags: tags,
      snowBuddies: buddies,
      spots: spots,
      isPublic: accessRight,
      isSubmitted: true,
      createTime: serverTimestamp(),
      likeUsers: ['2', '3', '4'],
      dislikeUsers: ['5'],
      likeCount: 2,
      viewCount: 1000,
      comments: []
    }
    await setDoc(doc(db, 'routes', routeID), data)
    toast.success('Submitted route!', {
      position: 'top-right',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: 'light',
      onClose: () => {
        navigate('/')
      }
    })
  }

  useEffect(() => {
    if (!routeID) {
      const id = uuidv4()
      setRouteID(id)
      alert(`Created route id:${id}!`)
    }
  }, [])

  useEffect(() => {
    console.log(spots)
  }, [spots])

  return (
    <div className='flex w-full'>
      <div className='h-screen-64px flex w-full'>
        <div className='h-full w-2/3 bg-zinc-100'>
          {gpxUrl ? (
            <Map gpxUrl={gpxUrl} />
          ) : (
            <div className='h-full w-full p-4'>
              <div
                className={`flex h-full w-full items-center justify-center rounded-lg border-2 border-dashed ${
                  isDragOver ? 'border-zinc-400 bg-zinc-100' : 'border-zinc-600 bg-zinc-200'
                }`}
                onDragOver={(e) => handleDragOver(e)}
                onDragLeave={(e) => handleDragLeave(e)}
                onDrop={(e) => handleDrop(e)}
              >
                <div
                  className={`rounded-2xl bg-zinc-100 text-lg font-bold hover:bg-zinc-300 ${
                    isDragOver && 'text-zinc-300'
                  }`}
                >
                  <label htmlFor='gpxFile' className='cursor-pointer rounded-l-2xl pl-4'>
                    Drag GPX file or&nbsp;
                  </label>
                  <label
                    htmlFor='gpxFile'
                    className='cursor-pointer rounded-r-2xl pr-4 underline underline-offset-2'
                  >
                    Browse file
                  </label>
                  <input
                    className='hidden'
                    type='file'
                    id='gpxFile'
                    onChange={handleGpxFile}
                    accept='.gpx'
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <form className='flex h-full w-1/3 flex-col justify-between overflow-y-auto overflow-x-hidden bg-blue-100 p-4'>
          <div className='flex flex-col gap-2 p-2'>
            <p>{routeID}</p>
            {gpxUrl && (
              <div className='flex items-center gap-2'>
                <label
                  htmlFor='gpxFile'
                  className='w-fit cursor-pointer rounded-2xl bg-zinc-100 pl-4 pr-4 text-lg font-bold hover:bg-zinc-300'
                >
                  Alter GPX file
                </label>
                {gpxFileName && <p>{gpxFileName}</p>}
              </div>
            )}

            <div
              className='flex w-full cursor-pointer flex-wrap items-center justify-between bg-white'
              onClick={() => toggleRouteVisibility()}
            >
              <p className='text-xl font-bold'>Route</p>
              <img
                className='h-8 w-8'
                src={`${routeVisibility ? HideArrow : ShowArrow}`}
                alt={`${routeVisibility ? 'Show' : 'Hide'}`}
              />
              <div className='w-full border border-zinc-300' />
            </div>

            <div className={`mb-4 flex flex-col gap-2 ${!routeVisibility && 'hidden'}`}>
              <label className='w-40 text-lg font-bold'>Route Title:</label>
              <input
                type='text'
                value={routeTitle}
                onChange={(event) => {
                  handleRouteTitle(event)
                }}
                className='h-10 p-2'
              />
              <label className='text-lg font-bold'>Route Description:</label>
              <textarea
                className='h-fit w-full resize-none p-2'
                placeholder='Add route description'
                value={routeDescription}
                onChange={(event) => handleRouteDescription(event)}
              />
              <label className='w-40 text-lg font-bold'>Date:</label>
              <input type='text' className='h-10 p-2' />
              <label className='text-lg font-bold'>Tag this route:</label>
              <textarea
                className='h-fit w-full resize-none p-2'
                placeholder='Press Enter to add tag ex. niseko, gondola, the-best-lift'
                onChange={(event) => handleTagInput(event)}
                onKeyDown={handleTagInputKeyDown}
                value={tagInput}
              />
              <div className='flex gap-2'>
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className='flex h-auto w-fit rounded-md bg-zinc-400 pl-2 pr-2 text-sm'
                  >
                    {tag}
                    <button onClick={() => handleTagDelete(index)}>X</button>
                  </span>
                ))}
              </div>
              <label className='text-lg font-bold'>Tag snow buddy:</label>
              <textarea
                className='h-fit w-full resize-none p-2'
                placeholder='Press Enter to tag snow buddy with this route'
                onChange={(event) => handleBuddyInput(event)}
                onKeyDown={handleBuddyInputKeyDown}
                value={buddyInput}
              />
              <div className='flex gap-2'>
                {buddies.map((buddy, index) => (
                  <span
                    key={index}
                    className='flex h-auto w-fit rounded-md bg-zinc-400 pl-2 pr-2 text-sm'
                  >
                    {buddy}
                    <button onClick={() => handleBuddyDelete(index)}>X</button>
                  </span>
                ))}
              </div>

              <p className='w-40 text-lg font-bold'>Set Access Right:</p>
              <div className='flex gap-4'>
                <div
                  className={`w-16 cursor-pointer rounded-md text-center ${
                    accessRight === true ? 'bg-yellow-200' : 'bg-white'
                  }`}
                  onClick={() => handleAccessRight(true)}
                >
                  Public
                </div>
                <div
                  className={`w-16 cursor-pointer rounded-md text-center ${
                    accessRight === false ? 'bg-yellow-200' : 'bg-white'
                  }`}
                  onClick={() => handleAccessRight(false)}
                >
                  Private
                </div>
              </div>
            </div>

            <div
              className='flex w-full cursor-pointer flex-wrap items-center justify-between bg-white'
              onClick={() => toggleSpotVisibility()}
            >
              <p className='text-xl font-bold'>Spots</p>
              <img
                className='h-8 w-8'
                src={`${spotVisibility ? HideArrow : ShowArrow}`}
                alt={`${spotVisibility ? 'Show' : 'Hide'}`}
              />
              <div className='w-full border border-zinc-300' />
            </div>

            <div className={`mb-4 flex flex-col gap-2 ${!spotVisibility && 'hidden'}`}>
              {spots.map((spot, index) => (
                <div key={index} className='flex flex-col gap-2'>
                  <div className='flex items-center justify-between'>
                    <p className='w-full text-lg font-bold underline'>{`Spot ${index + 1}`}</p>
                    <p
                      className='cursor-pointer rounded-md bg-zinc-100 pl-2 pr-2 text-sm'
                      onClick={() => handleRemoveSpot(index)}
                    >
                      Delete
                    </p>
                  </div>
                  <label className='w-40 text-lg font-bold'>Spot Title:</label>
                  <input
                    type='text'
                    value={spot.spotTitle}
                    onChange={(event) => {
                      handleUpdateSpot(index, { ...spot, spotTitle: event.target.value })
                    }}
                    className='h-10 p-2'
                  />
                  <label className='text-lg font-bold'>Spot Description:</label>
                  <textarea
                    className='h-fit w-full resize-none p-2'
                    placeholder='Add spot description'
                    value={spot.spotDescription}
                    onChange={(event) =>
                      handleUpdateSpot(index, { ...spot, spotDescription: event.target.value })
                    }
                  />
                  <label
                    htmlFor={`imageFile${index}`}
                    className='h-fit w-fit cursor-pointer rounded-2xl bg-zinc-300 pl-4 pr-4 text-lg font-bold'
                  >
                    Upload images
                  </label>
                  <input
                    className='hidden'
                    type='file'
                    id={`imageFile${index}`}
                    accept='image/jpeg, image/png, image/svg+xml'
                    onChange={(event) => handleImages(event, index)}
                  />
                  <div className='flex gap-2'>
                    {spot.imageUrls.map((url, i) => (
                      <img key={i} src={url} alt={`Image ${i}`} className='h-auto w-8' />
                    ))}
                  </div>
                  <label
                    htmlFor={`videoFile${index}`}
                    className='h-fit w-fit cursor-pointer rounded-2xl bg-zinc-300 pl-4 pr-4 text-lg font-bold'
                  >
                    Upload videos
                  </label>
                  <input
                    className='hidden'
                    type='file'
                    id={`videoFile${index}`}
                    accept='video/mp4'
                    onChange={(event) => handleVideos(event, index)}
                  />
                  <div className='flex gap-2'></div>
                  {spot.videoUrls.map((url, i) => (
                    <video key={i} controls width='150' height='100'>
                      <source src={url} type='video/mp4' />
                    </video>
                  ))}
                </div>
              ))}

              <div
                className='h-fit w-full cursor-pointer rounded-2xl bg-zinc-300 pl-4 pr-4 text-center text-lg font-bold'
                onClick={() => handleAddSpot()}
              >
                Add spot
              </div>
            </div>
          </div>

          <div className='mt-8 flex justify-between'>
            <div
              className='h-fit w-fit cursor-pointer rounded-3xl bg-zinc-300 p-4 text-lg font-bold'
              onClick={() => handleSaveDraft()}
            >
              Save draft
            </div>
            <div
              className='h-fit w-fit cursor-pointer rounded-3xl bg-zinc-300 p-4 text-lg font-bold'
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
