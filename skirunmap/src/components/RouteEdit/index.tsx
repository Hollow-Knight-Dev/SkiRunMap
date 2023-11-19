import { useState } from 'react'

const EditRoute: React.FC = () => {
  const [accessRight, setAccessRight] = useState<string>('')

  const handleMenuClick = (option: string) => {
    setAccessRight(option)
  }

  return (
    <div>
      <div className='flex'>
        <div className='w-2/3 h-screen bg-zinc-500'>
          <p>Google Map api</p>
        </div>
        <form className='w-1/3 h-screen bg-zinc-200 flex flex-col p-4'>
          <div className='w-fit h-fit bg-zinc-300 rounded-2xl pl-4 pr-4 text-lg font-bold cursor-pointer'>
            Upload GPX
          </div>
          <div className='p-2 flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <label className='w-40 text-lg font-bold'>Route Title</label>
              <input className='h-10' />
            </div>
            <div className='flex items-center gap-2'>
              <label className='w-40 text-lg font-bold'>Spot Title</label>
              <input className='h-10' />
            </div>
            <textarea className='w-full h-20 p-2' placeholder='Add text' />
            <textarea
              className='w-full h-20 p-2'
              placeholder='Add tag ex. #niseko # gondola'
            />
            <div className='flex flex-wrap gap-2 '>
              <div className='w-fit h-fit bg-zinc-300 rounded-2xl pl-4 pr-4 text-lg font-bold cursor-pointer'>
                Add image
              </div>
              <div className='w-fit h-fit bg-zinc-300 rounded-2xl pl-4 pr-4 text-lg font-bold cursor-pointer'>
                Add video
              </div>
              <div className='w-fit h-fit bg-zinc-300 rounded-2xl pl-4 pr-4 text-lg font-bold cursor-pointer'>
                Add snow buddy
              </div>
            </div>
            <div className='flex gap-2'>
              <p className='w-40 text-lg font-bold'>Set Access Right</p>
              <div
                className={`w-16 rounded-md cursor-pointer text-center ${
                  accessRight === 'Public' ? 'bg-yellow-200' : 'bg-white'
                }`}
                onClick={() => handleMenuClick('Public')}
              >
                Public
              </div>
              <div
                className={`w-16 rounded-md cursor-pointer text-center ${
                  accessRight === 'Private' ? 'bg-yellow-200' : 'bg-white'
                }`}
                onClick={() => handleMenuClick('Private')}
              >
                Private
              </div>
            </div>
            <div className='w-fit h-fit bg-zinc-300 rounded-2xl pl-4 pr-4 text-lg font-bold cursor-pointer'>
              Add spot
            </div>
          </div>

          <button className='w-fit h-fit bg-zinc-300 rounded-3xl p-4 text-lg font-bold self-end mt-8'>
            Submit route
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditRoute
