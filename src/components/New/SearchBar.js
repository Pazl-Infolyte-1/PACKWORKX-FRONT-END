import React, { useState } from 'react'
import { useSearch } from './SearchContext'
import { IoSearch } from 'react-icons/io5'

const SearchBar = ({ text, data }) => {
  const { handleSearch } = useSearch()
  const [query, setQuery] = useState('')

  const handleChange = (event) => {
    const newQuery = event.target.value
    setQuery(newQuery)
    handleSearch(newQuery, data)
  }

  return (
    <div>
      <div className="flex items-center h-[35px] w-[300px] gap-[2px]">
        <div className="bg-white h-full w-10 flex justify-center items-center rounded-l-md">
          <IoSearch />
        </div>
        <input
          type="text"
          placeholder={`Search ${text}`}
          className="outline-none h-full w-full rounded-r-md pl-2"
          value={query}
          onChange={handleChange}
        />
      </div>
    </div>
  )
}

export default SearchBar
