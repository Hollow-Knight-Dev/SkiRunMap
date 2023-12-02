const MemberInfo = () => {
  return (
    <div className='h-screen-256px flex items-center justify-center bg-zinc-200'>
      <div className='mb-8 flex w-full flex-col items-center gap-8'>
        <div className='flex w-4/5 flex-col gap-2'>
          <div className='flex h-fit items-center justify-center rounded-full bg-blue-600 p-1 pl-4 text-lg text-white'>
            <label className='w-48'>Email</label>
            <input
              className='h-6 w-3/5 rounded-full bg-blue-500 pl-4'
              type='email'
              // value={email}
              // onChange={(e) => handleEmail(e)}
            />
          </div>
          <div className='flex h-fit items-center justify-center rounded-full bg-blue-600 p-1 pl-4 text-lg text-white'>
            <label className='w-48'>Username</label>
            <input
              className='h-6 w-3/5 rounded-full bg-blue-500 pl-4'
              type='text'
              // value={password}
              // onChange={(e) => handlePassword(e)}
            />
          </div>
        </div>
        <div className='flex w-4/5 flex-col gap-2'>
          <div className='flex h-fit items-center justify-center rounded-full bg-blue-600 p-1 pl-4 text-lg text-white'>
            <label className='w-48'>Ski/ Snowboard age</label>
            <input
              className='h-6 w-3/5 rounded-full bg-blue-500 pl-4'
              type='text'
              // value={password}
              // onChange={(e) => handlePassword(e)}
            />
          </div>
          <div className='flex h-fit items-center justify-center rounded-full bg-blue-600 p-1 pl-4 text-lg text-white'>
            <label className='w-48'>About me</label>
            <input
              className='h-6 w-3/5 rounded-full bg-blue-500 pl-4'
              type='text'
              // value={password}
              // onChange={(e) => handlePassword(e)}
            />
          </div>
        </div>
        <div className='flex w-4/5 flex-col gap-2'>
          <div className='flex h-fit items-center justify-center rounded-full bg-blue-600 p-1 pl-4 text-lg text-white'>
            <label className='w-48'>Country</label>
            <input
              className='h-6 w-3/5 rounded-full bg-blue-500 pl-4'
              type='text'
              // value={password}
              // onChange={(e) => handlePassword(e)}
            />
          </div>
          <div className='flex h-fit items-center justify-center rounded-full bg-blue-600 p-1 pl-4 text-lg text-white'>
            <label className='w-48'>Gender</label>
            <input
              className='h-6 w-3/5 rounded-full bg-blue-500 pl-4'
              type='text'
              // value={password}
              // onChange={(e) => handlePassword(e)}
            />
          </div>
        </div>

        <div className='flex gap-8'>
          <button className='h-fit w-fit rounded-full bg-blue-500 p-4 text-white hover:bg-blue-600'>
            Previous step
          </button>
          <button className='h-fit w-fit rounded-full bg-blue-500 p-4 text-white hover:bg-blue-600'>
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default MemberInfo
