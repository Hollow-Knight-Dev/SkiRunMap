import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useEffect } from 'react'
import { db, storage } from '../../auth/CloudStorage'
import {
  useAccessRight,
  useBuddies,
  useBuddyInput,
  useGpxUrl,
  useImageUrls,
  useRouteID,
  useRouteTitle,
  useSpotDescription,
  useSpotTitle,
  useTagInput,
  useTags,
  useVideoUrls
} from '../../store/useRoute'
import Map from '../Map'
import RouteCreate from '../RouteCreate'

// const gpxFilePath = 'src/components/RouteEdit/Central-Ontario-Loop-Trail-COLT.gpx'
// const gpxFilePath = 'src/components/RouteEdit/gpx-sample.gpx'

const EditRoute: React.FC = () => {
  const routeID = useRouteID((state) => state.routeID)
  const routeTitle = useRouteTitle((state) => state.routeTitle)
  const setRouteTitle = useRouteTitle((state) => state.setRouteTitle)
  const spotTitle = useSpotTitle((state) => state.spotTitle)
  const setSpotTitle = useSpotTitle((state) => state.setSpotTitle)
  const spotDescription = useSpotDescription((state) => state.spotDescription)
  const setSpotDescription = useSpotDescription((state) => state.setSpotDescription)
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
  const imageUrls = useImageUrls((state) => state.imageUrls)
  const setImageUrls = useImageUrls((state) => state.setImageUrls)
  const videoUrls = useVideoUrls((state) => state.videoUrls)
  const setVideoUrls = useVideoUrls((state) => state.setVideoUrls)

  const routesRef = ref(storage, 'routes')
  const routeRef = ref(routesRef, routeID)
  const imagesRef = ref(routeRef, 'images')
  const videosRef = ref(routeRef, 'videos')

  useEffect(() => {
    console.log(imageUrls, videoUrls)
  }, [imageUrls, videoUrls])

  const handleRouteTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value
    if (title.length <= 30) {
      setRouteTitle(title)
    } else {
      alert('Route title exceeds letter limitation')
      setRouteTitle(title.slice(0, 30))
    }
  }

  const handleSpotTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value
    if (title.length <= 30) {
      setSpotTitle(title)
    } else {
      alert('Spot title exceeds letter limitation')
      setSpotTitle(title.slice(0, 30))
    }
  }

  const handleRouteDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const description = event.target.value
    if (description.length <= 50) {
      setSpotDescription(description)
    } else {
      alert('Description exceeds letter limitation')
      setSpotDescription(description.slice(0, 50))
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
      .then((snapshot) => {
        console.log('Uploaded gpx file!')
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
        uploadAndDownloadGpx(file, routeID.concat('.gpx'))
      } else {
        alert('Invalid file type. Please upload a GPX file.')
      }
    } else {
      alert('Please select a GPX file.')
      return
    }
  }

  const uploadAndDownloadImages = (file: File, fileName: string) => {
    const imageRef = ref(imagesRef, fileName)
    uploadBytes(imageRef, file)
      .then((snapshot) => {
        console.log('Uploaded image!')
        return getDownloadURL(imageRef)
      })
      .then((url) => {
        const newUrls = [...imageUrls, url]
        setImageUrls(newUrls)
      })
      .catch((error) => console.log('Failed to uplaod and download image file', error))
  }

  const handleImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target
    const files: FileList | null = fileInput.files

    if (files) {
      const file: File = files[0]
      if (file.name) {
        uploadAndDownloadImages(file, file.name)
      } else {
        alert('Invalid file type. Please upload an image.')
      }
    } else {
      alert('Please select an image.')
      return
    }
  }

  const uploadAndDownloadVideos = (file: File, fileName: string) => {
    const videoRef = ref(videosRef, fileName)
    uploadBytes(videoRef, file)
      .then((snapshot) => {
        console.log('Uploaded video!')
        return getDownloadURL(videoRef)
      })
      .then((url) => {
        const newUrls = [...videoUrls, url]
        setVideoUrls(newUrls)
      })
      .catch((error) => console.log('Failed to uplaod and download mp4 file', error))
  }

  const handleVideos = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target
    const files: FileList | null = fileInput.files

    if (files) {
      const file: File = files[0]
      if (file.name) {
        uploadAndDownloadVideos(file, file.name)
      } else {
        alert('Invalid file type. Please upload an MP4 video.')
      }
    } else {
      alert('Please select an MP4 video.')
      return
    }
  }

  const handleSaveDraft = async () => {
    const data = {
      userID: '1',
      username: 'I Am Groot',
      routeID: routeID,
      routeTitle: routeTitle,
      gpxUrl: gpxUrl,
      routeCoordinate: [42.827069873533766, 140.80677808428817],
      tags: tags,
      snowBuddies: buddies,
      spots: [
        {
          spotTitle: spotTitle,
          spotDescription: spotDescription,
          spotCoordinate: [42.827069873533766, 140.80677808428817],
          images: imageUrls,
          videos: videoUrls
        }
      ],
      isPublic: accessRight,
      isSubmitted: false,
      createTime: serverTimestamp(),
      likeUsers: ['2', '3', '4'],
      dislikeUsers: ['5'],
      likeCount: 2,
      viewCount: 1000,
      comments: [
        { comment: 'Nice choice!', commentTime: '17 November 2023 at 14:00:00 UTC+8', userID: '3' }
      ]
    }
    await setDoc(doc(db, 'routes', routeID), data).then(() => alert('Saved in draft!'))
  }

  const handleSubmit = async () => {
    const data = {
      userID: '1',
      username: 'I Am Groot',
      routeID: routeID,
      routeTitle: routeTitle,
      gpxUrl: gpxUrl,
      routeCoordinate: [42.827069873533766, 140.80677808428817],
      tags: tags,
      snowBuddies: buddies,
      spots: [
        {
          spotTitle: spotTitle,
          spotDescription: spotDescription,
          spotCoordinate: [42.827069873533766, 140.80677808428817],
          images: imageUrls,
          videos: videoUrls
        }
      ],
      isPublic: accessRight,
      isSubmitted: true,
      createTime: serverTimestamp(),
      likeUsers: ['2', '3', '4'],
      dislikeUsers: ['5'],
      likeCount: 2,
      viewCount: 1000,
      comments: [
        { comment: 'Nice choice!', commentTime: '17 November 2023 at 14:00:00 UTC+8', userID: '3' }
      ]
    }
    await setDoc(doc(db, 'routes', routeID), data).then(() => alert('Route been submitted!'))
  }

  return (
    <div>
      {!routeID && (
        <div className='z-10 bg-black'>
          <RouteCreate />
        </div>
      )}
      <div className='flex'>
        <div className='h-screen w-2/3 bg-zinc-500'>
          <Map gpxUrl={gpxUrl} />
        </div>
        <form className='flex h-screen w-1/3 flex-col bg-zinc-200 p-4'>
          <label
            htmlFor='gpxFile'
            className='h-fit w-fit cursor-pointer rounded-2xl bg-zinc-300 pl-4 pr-4 text-lg font-bold'
          >
            Upload GPX file
          </label>
          <input
            className='hidden'
            type='file'
            id='gpxFile'
            onChange={handleGpxFile}
            accept='application/octet-stream'
          />
          <div className='flex flex-col gap-2 p-2'>
            <div className='flex items-center gap-2'>
              <label className='w-40 text-lg font-bold'>Route Title</label>
              <input
                type='text'
                value={routeTitle}
                onChange={(event) => {
                  handleRouteTitle(event)
                }}
                className='h-10'
              />
            </div>
            <div className='flex items-center gap-2'>
              <label className='w-40 text-lg font-bold'>Spot Title</label>
              <input
                type='text'
                value={spotTitle}
                onChange={(event) => {
                  handleSpotTitle(event)
                }}
                className='h-10'
              />
            </div>
            <textarea
              className='h-10 w-full p-2'
              placeholder='Add text'
              value={spotDescription}
              onChange={(event) => handleRouteDescription(event)}
            />
            <textarea
              className='h-10 w-full p-2'
              placeholder='Add tag ex. niseko, gondola, the-best-lift'
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
            <textarea
              className='h-10 w-full p-2'
              placeholder='Tag snow buddy with this route'
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
            <div className='flex flex-wrap gap-2'>
              <label
                htmlFor='imageFile'
                className='h-fit w-fit cursor-pointer rounded-2xl bg-zinc-300 pl-4 pr-4 text-lg font-bold'
              >
                Upload images
              </label>
              <input
                className='hidden'
                type='file'
                id='imageFile'
                accept='image/jpeg, image/png, image/svg+xml'
                onChange={handleImages}
              />
              <p>{imageUrls}</p>
              <label
                htmlFor='videoFile'
                className='h-fit w-fit cursor-pointer rounded-2xl bg-zinc-300 pl-4 pr-4 text-lg font-bold'
              >
                Upload video
              </label>
              <input
                className='hidden'
                type='file'
                id='videoFile'
                accept='video/mp4'
                onChange={handleVideos}
              />
              <p>{videoUrls}</p>
            </div>
            <div className='flex gap-2'>
              <p className='w-40 text-lg font-bold'>Set Access Right</p>
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
            <div className='h-fit w-fit cursor-pointer rounded-2xl bg-zinc-300 pl-4 pr-4 text-lg font-bold'>
              Add spot
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
