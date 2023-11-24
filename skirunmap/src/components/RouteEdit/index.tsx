import { ref, uploadBytes } from 'firebase/storage'
import { useEffect, useState } from 'react'
import { storage } from '../../auth/CloudStorage'
import {
  useAccessRight,
  useRouteDescription,
  useRouteID,
  useRouteTitle,
  useSpotTitle,
  useTag
} from '../../store/useRoute'
import Map from '../Map'
import RouteCreate from '../RouteCreate'

// const gpxFilePath = 'src/components/RouteEdit/Central-Ontario-Loop-Trail-COLT.gpx'
const gpxFilePath = 'src/components/RouteEdit/gpx-sample.gpx'

const EditRoute: React.FC = () => {
  const [gpxURL, setGpxURL] = useState<string>('')

  const routeID = useRouteID((state) => state.routeID)
  const routeTitle = useRouteTitle((state) => state.routeTitle)
  const setRouteTitle = useRouteTitle((state) => state.setRouteTitle)
  const spotTitle = useSpotTitle((state) => state.spotTitle)
  const setSpotTitle = useSpotTitle((state) => state.setSpotTitle)
  const routeDescription = useRouteDescription((state) => state.routeDescription)
  const setRouteDescription = useRouteDescription((state) => state.setRouteDescription)
  const [tagInput, setTagInput] = useState<string>('')
  const tag = useTag((state) => state.tag)
  const setTag = useTag((state) => state.setTag)
  const accessRight = useAccessRight((state) => state.accessRight)
  const setAccessRight = useAccessRight((state) => state.setAccessRight)

  useEffect(() => {
    console.log(tag, routeID)
  }, [tag])

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
      setRouteDescription(description)
    } else {
      alert('Description exceeds letter limitation')
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
    if ((event.key === ' ' || event.key === 'Enter') && tagInput.trim() !== '') {
      setTag([...tag, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleTagDelete = (index: number) => {
    const newTags = [...tag]
    newTags.splice(index, 1)
    setTag(newTags)
  }

  const handleAccessRight = (newRight: boolean) => {
    setAccessRight(newRight)
  }

  const uploadGpx = (file: File, fileName: string) => {
    const storageRef = ref(storage)
    const routesRef = ref(storage, 'routes')
    const routeRef = ref(routesRef, routeID)
    const gpxFileRef = ref(routeRef, fileName)
    const metadata = {
      contentType: 'application/octet-stream'
    }
    uploadBytes(gpxFileRef, file, metadata)
      .then((snapshot) => {
        console.log('Uploaded gpx file!')
      })
      .catch((error) => console.log('Failed to uplaod gpx file', error))
  }

  // const getGpx = () => {
  // getDownloadURL(ref(storage, 'Rusutsu.gpx')).then((url) => {
  //   setGpxURL(url)
  // })

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target
    const files: FileList | null = fileInput.files

    if (files) {
      const file: File = files[0]
      if (file.name !== undefined && file.name.toLowerCase().endsWith('.gpx')) {
        uploadGpx(file, routeID.concat('.gpx'))
      } else {
        alert('Invalid file type. Please upload a GPX file.')
      }
    } else {
      alert('Please select a GPX file.')
      return
    }
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
          <Map gpxFileUrl={gpxFilePath} />
        </div>
        <form className='flex h-screen w-1/3 flex-col bg-zinc-200 p-4'>
          <label
            htmlFor='gpxfile'
            className='h-fit w-fit cursor-pointer rounded-2xl bg-zinc-300 pl-4 pr-4 text-lg font-bold'
          >
            Upload GPX file
          </label>
          <input
            className='hidden'
            type='file'
            id='gpxfile'
            onChange={handleFileChange}
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
              className='h-20 w-full p-2'
              placeholder='Add text'
              value={routeDescription}
              onChange={(event) => handleRouteDescription(event)}
            />
            <textarea
              className='h-20 w-full p-2'
              placeholder='Add tag ex. niseko, gondola, the-best-lift'
              onChange={(event) => handleTagInput(event)}
              onKeyDown={handleTagInputKeyDown}
              value={tagInput}
            />
            <div className='flex gap-2'>
              {tag.map((tag, index) => (
                <span
                  key={index}
                  className='flex h-auto w-fit rounded-md bg-zinc-400 pl-2 pr-2 text-sm'
                >
                  {tag}
                  <button onClick={() => handleTagDelete(index)}>X</button>
                </span>
              ))}
            </div>
            <div className='flex flex-wrap gap-2'>
              <div className='h-fit w-fit cursor-pointer rounded-2xl bg-zinc-300 pl-4 pr-4 text-lg font-bold'>
                Add image
              </div>
              <div className='h-fit w-fit cursor-pointer rounded-2xl bg-zinc-300 pl-4 pr-4 text-lg font-bold'>
                Add video
              </div>
              <div className='h-fit w-fit cursor-pointer rounded-2xl bg-zinc-300 pl-4 pr-4 text-lg font-bold'>
                Add snow buddy
              </div>
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

          <button className='mt-8 h-fit w-fit self-end rounded-3xl bg-zinc-300 p-4 text-lg font-bold'>
            Submit route
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditRoute
