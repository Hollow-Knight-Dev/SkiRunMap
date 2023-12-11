import { collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { db } from '../../auth/CloudStorage'
import { RouteKeywords } from '../../store/useSearch'
import SearchIcon from './search-icon.png'

const SearchBar = () => {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState<string>('')
  const [suggestKeywords, setSuggestKeywords] = useState<string[]>([])
  const [actualKeywords, setActualKeywords] = useState<string[]>([])
  const [selectedKeyword, setSelectedKeyword] = useState<string>('')
  const [isFocus, setIsFocus] = useState<boolean>(false)

  // useEffect(() => {
  //   console.log(selectedKeyword)
  // }, [selectedKeyword])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const searchBar = document.getElementById('search-bar')
      if (searchBar && !searchBar.contains(event.target as Node)) {
        setIsFocus(false)
        setSelectedKeyword('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setIsFocus])

  const handleSearchInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setSearchInput(input)
    setSelectedKeyword(input)

    if (input.trim() !== '') {
      const querySnapshot = await getDocs(collection(db, 'keywords'))
      const results: string[] = []
      const actualResults: string[] = []

      querySnapshot.forEach((doc) => {
        const docData = doc.data() as RouteKeywords
        const keywords = docData.keywords
        keywords.forEach((kw) => {
          if (kw.toLowerCase().includes(input.trim().toLowerCase())) {
            if (!results.includes(kw.toLowerCase())) {
              results.push(kw.toLowerCase())
              actualResults.push(kw)
            }
          }
        })
        setSuggestKeywords(results)
        setActualKeywords(actualResults)
      })
    } else {
      setSuggestKeywords([])
      setActualKeywords([])
    }
  }

  const handleInputFocus = () => {
    setIsFocus(true)
  }

  const handleInputClick = () => {
    setSelectedKeyword(searchInput)
  }

  const handleMouseEnter = (keyword: string) => {
    setSelectedKeyword(keyword)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      const currentIndex = suggestKeywords.indexOf(selectedKeyword)
      const lastIndex = suggestKeywords.length - 1
      let newIndex

      if (e.key === 'ArrowUp') {
        newIndex = currentIndex === 0 ? lastIndex : currentIndex - 1
      } else {
        newIndex = currentIndex === lastIndex ? 0 : currentIndex + 1
      }
      setSelectedKeyword(suggestKeywords[newIndex])
    } else if (e.key === 'Enter') {
      if (selectedKeyword) {
        handleSearch(selectedKeyword)
      } else {
        toast.warn('Please enter keyword', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: 'light'
        })
      }
    }
  }

  const handleSearch = (searchKeyword: string) => {
    const url = `/search/${encodeURIComponent(searchKeyword)}`
    navigate(url, { state: { suggestedKeywords: actualKeywords } })
    setSearchInput('')
    setSuggestKeywords([])
  }

  const handleSuggestionClick = (searchKeyword: string) => {
    handleSearch(searchKeyword)
  }

  const handleIconClickSearch = (searchKeyword: string) => {
    if (searchKeyword.trim() !== '') {
      handleSearch(searchKeyword)
    } else {
      toast.warn('Please enter keyword', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'light'
      })
    }
  }

  return (
    <div className='relative w-96 duration-300 hover:translate-y-[-2px]' id='search-bar'>
      <input
        className='w-full rounded-3xl border border-zinc-300 p-2 pl-12 text-xl leading-4 shadow-[10px_10px_10px_-12px_#7e7e7e] duration-300 hover:shadow-[10px_12px_10px_-12px_#7e7e7e]'
        placeholder='Enter resort, ski run, or tag name'
        value={searchInput}
        onChange={(e) => handleSearchInput(e)}
        onFocus={() => handleInputFocus()}
        onKeyDown={(e) => handleInputKeyDown(e)}
        onClick={() => handleInputClick()}
      />
      <img
        className='absolute left-5 top-[13px] h-4 w-4 cursor-pointer'
        src={SearchIcon}
        alt='Search Icon'
        onClick={() => handleIconClickSearch(searchInput)}
      />
      {isFocus && suggestKeywords.length > 0 && (
        <div
          className='ml-5 mr-5 mt-[2px] flex flex-col rounded-xl bg-white/60 pb-2 pt-2'
          onMouseLeave={() => setSelectedKeyword('')}
        >
          {suggestKeywords.map((keyword, index) => (
            <div
              key={index}
              className={`flex cursor-pointer items-center gap-3 pl-2 duration-100 ${
                selectedKeyword === keyword && 'bg-white'
              }`}
              onClick={() => handleSuggestionClick(keyword)}
              onMouseEnter={() => handleMouseEnter(keyword)}
            >
              <img className='h-3 w-3' src={SearchIcon} alt='Search Icon' />
              <p className='text-lg'>{keyword}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar
