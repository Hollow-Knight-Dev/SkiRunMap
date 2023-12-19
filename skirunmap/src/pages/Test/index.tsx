const Test = () => {
  return (
    <div className='h-screen-64px bg-groomed-piste flex items-center justify-center'>
      <div className='flex h-full w-full flex-col items-center gap-8'>
        <div className='bg-ski-input flex h-[60px] w-[900px] items-center pl-40 font-bold'>
          <label className='w-36 text-2xl italic text-white'>Email</label>
          <input className='h-6 w-2/5 rounded-lg bg-white/95 pl-4 text-xl italic' type='email' />
        </div>
        <div className='bg-ski-input flex h-[60px] w-[900px] items-center pl-40 font-bold'>
          <label className='w-36 text-2xl italic text-white'>Password</label>
          <input className='h-6 w-2/5 rounded-lg bg-white/95 pl-4 text-xl' type='password' />
        </div>
      </div>
    </div>
  )
}

export default Test
