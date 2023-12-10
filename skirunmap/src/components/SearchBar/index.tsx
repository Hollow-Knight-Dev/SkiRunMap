import SearchIcon from './search-icon.png'

const SearchBar = () => {
  return (
    <div className='relative w-96 duration-300 hover:translate-y-[-2px]'>
      <input
        className='w-full rounded-3xl border border-zinc-300 p-2 pl-6 shadow-[10px_10px_10px_-12px_#7e7e7e] duration-300 hover:shadow-[10px_12px_10px_-12px_#7e7e7e]'
        placeholder='Enter resort, ski run, or tag name'
      />
      <img className='absolute right-4 top-[11px] h-5 w-5' src={SearchIcon} alt='Search Icon' />
    </div>
  )
}

export default SearchBar
