import { collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../../auth/Firebase'
import SearchIcon from '../../images/search-icon.png'
import { RouteKeywords } from '../../store/useSearch'
import showToast from '../../utils/showToast'

const SearchBar = () => {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState<string>('')
  const [suggestKeywords, setSuggestKeywords] = useState<string[]>([])
  const [selectedKeyword, setSelectedKeyword] = useState<string>('')
  const [isFocus, setIsFocus] = useState<boolean>(false)
  const suggestKeywordListLimit = 20

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
        if (results.length > suggestKeywordListLimit) {
          setSuggestKeywords(results.sort().slice(0, suggestKeywordListLimit))
        } else {
          setSuggestKeywords(results.sort())
        }
      })
    } else {
      setSuggestKeywords([])
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
        showToast('warn', 'Please enter keyword.')
      }
    }
  }

  const handleSearch = (searchKeyword: string) => {
    const url = `/search/${encodeURIComponent(searchKeyword)}`
    navigate(url)
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
      showToast('warn', 'Please enter keyword.')
    }
  }

  return (
    <div className='relative z-40 h-full w-full' id='search-bar'>
      <input
        className='h-full w-full rounded-3xl p-2 pl-12 text-xl italic leading-4 shadow-[3px_5px_7px_-6px_#7e7e7e] duration-300 hover:shadow-[10px_12px_10px_-12px_#7e7e7e]'
        placeholder='Enter resort, ski run, or tag name'
        value={searchInput}
        onChange={(e) => handleSearchInput(e)}
        onFocus={() => handleInputFocus()}
        onKeyDown={(e) => handleInputKeyDown(e)}
        onClick={() => handleInputClick()}
      />
      <img
        className='absolute inset-x-6 inset-y-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer'
        src={SearchIcon}
        alt='Search Icon'
        onClick={() => handleIconClickSearch(searchInput)}
      />
      {isFocus && suggestKeywords.length > 0 && (
        <div
          className='ml-5 mr-5 flex h-72 flex-col overflow-y-auto rounded-xl bg-white shadow-[0px_4px_8px_-4px_#7e7e7e]'
          onMouseLeave={() => setSelectedKeyword('')}
        >
          {suggestKeywords.map((keyword, index) => (
            <div
              key={index}
              className={`flex cursor-pointer items-center gap-3 pl-2 duration-100 ${
                selectedKeyword === keyword && 'bg-blue-50'
              }`}
              onClick={() => handleSuggestionClick(keyword)}
              onMouseEnter={() => handleMouseEnter(keyword)}
            >
              <img className='h-3 w-3' src={SearchIcon} alt='Search Icon' />
              <p className='text-lg italic'>{keyword}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar
