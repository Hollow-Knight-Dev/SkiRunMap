import SearchBar from '../SearchBar'

const HeroHeader = () => {
  return (
    <div className='home-bg-image flex h-[600px] w-full justify-center'>
      {/* Photo by Pixabay from Pexels */}
      <div className='mt-24 flex h-max w-max flex-col items-center'>
        <p className='mb-4 w-max text-4xl font-bold italic drop-shadow-[2px_1px_0px_rgba(255,255,255,0.8)]'>
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
