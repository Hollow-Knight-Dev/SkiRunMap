import SearchBar from '../SearchBar'

const HeroHeader = () => {
  return (
    <div className='home-bg-image flex h-72 w-full justify-center'>
      {/* Photo by Pixabay from Pexels */}
      <div className='mt-[216px] flex h-max w-max flex-col items-center'>
        <p className='mb-2 w-max text-4xl font-bold italic text-white opacity-80 drop-shadow-[2px_1px_2px_rgba(0,0,0,0.7)]'>
          Explore your dream run
        </p>
        <div className='h-12 w-[600px]'>
          <SearchBar />
        </div>
      </div>
    </div>
  )
}

export default HeroHeader
