// SearchBar.js
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { useSearch } from './SearchContext'
import { IoSearch } from 'react-icons/io5'
import ClearIcon from '@mui/icons-material/Clear';

const SearchBar = forwardRef(({ placeholder = "Search..." }, ref) => {
  const { searchQuery, setGlobalSearchQuery, searchPlaceholder, clearSearch: contextClearSearch } = useSearch()
  const [localQuery, setLocalQuery] = useState(searchQuery || '')
  const [debounceTimer, setDebounceTimer] = useState(null)

  // Sync with context when searchQuery changes externally
  useEffect(() => {
    setLocalQuery(searchQuery || '')
  }, [searchQuery])

  useImperativeHandle(ref, () => ({
    clearSearch: () => {
      setLocalQuery('')
      contextClearSearch()
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
    },
  }))

  const handleChange = (event) => {
    const newQuery = event.target.value
    setLocalQuery(newQuery)

    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    setDebounceTimer(
      setTimeout(() => {
        setGlobalSearchQuery(newQuery)
      }, 500),
    )
  }

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
    }
  }, [debounceTimer])

  return (
    <div>
      <div className="flex items-center h-[35px] w-[300px] hover:w-[350px] hover:duration-300 gap-[2px] border rounded-md border-gray-600">
        <div className="text-white h-full w-10 flex justify-center items-center rounded-l-md border-gray-600 border-r-2">
          <IoSearch />
        </div>
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="outline-none h-full w-full rounded-r-md pl-2 bg-transparent text-xs text-white"
          value={localQuery}
          onChange={handleChange}
        />
        {searchQuery && (
          <div className="text-white h-full w-10 flex justify-center items-center ">
            <ClearIcon fontSize="inherit" onClick={() => contextClearSearch()} />
          </div>
        )}
      </div>
    </div>
  )
})

export default SearchBar