// import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useState } from 'react'
// import { storage } from '../../auth/CloudStorage'
import Map from '../Map'

// const gpxFilePath = 'src/components/RouteEdit/Central-Ontario-Loop-Trail-COLT.gpx'
const gpxFilePath = 'src/components/RouteEdit/gpx-sample.gpx'

const EditRoute: React.FC = () => {
  const [accessRight, setAccessRight] = useState<string>('')
  // const [gpxURL, setGpxURL] = useState<string>('')

  const handleMenuClick = (option: string) => {
    setAccessRight(option)
  }

  // const storageRef = ref(storage)
  // const gpxsRef = ref(storage, 'gpxs')

  // const uploadGpx = (file: File) => {
  //   const metadata = {
  //     contentType: 'application/octet-stream'
  //   }
  //   uploadBytes(gpxsRef, file, metadata)
  //     .then((snapshot) => {
  //       console.log('Uploaded gpx file!')
  //     })
  //     .catch((error) => console.log('Failed to uplaod gpx file', error))
  // }

  // const getGpx = () => {
  //   getDownloadURL(ref(storage, 'Rusutsu.gpx')).then((url) => {
  //     setGpxURL(url)
  //   })
  // }

  return (
    <div>
      <div className='flex'>
        <div className='h-screen w-2/3 bg-zinc-500'>
          <Map gpxFileUrl={gpxFilePath} />
        </div>
        <form className='flex h-screen w-1/3 flex-col bg-zinc-200 p-4'>
          <div className='h-fit w-fit cursor-pointer rounded-2xl bg-zinc-300 pl-4 pr-4 text-lg font-bold'>
            Upload GPX
          </div>
          <div className='flex flex-col gap-2 p-2'>
            <div className='flex items-center gap-2'>
              <label className='w-40 text-lg font-bold'>Route Title</label>
              <input className='h-10' />
            </div>
            <div className='flex items-center gap-2'>
              <label className='w-40 text-lg font-bold'>Spot Title</label>
              <input className='h-10' />
            </div>
            <textarea className='h-20 w-full p-2' placeholder='Add text' />
            <textarea className='h-20 w-full p-2' placeholder='Add tag ex. #niseko # gondola' />
            <div className='flex flex-wrap gap-2 '>
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
                  accessRight === 'Public' ? 'bg-yellow-200' : 'bg-white'
                }`}
                onClick={() => handleMenuClick('Public')}
              >
                Public
              </div>
              <div
                className={`w-16 cursor-pointer rounded-md text-center ${
                  accessRight === 'Private' ? 'bg-yellow-200' : 'bg-white'
                }`}
                onClick={() => handleMenuClick('Private')}
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
