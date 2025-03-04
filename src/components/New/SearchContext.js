import React, { createContext, useContext, useState } from 'react'

// Create the Search Context
const SearchContext = createContext()

// Provide search functionality
export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredSearchData, setFilteredSearchData] = useState([])

  const handleSearch = (query, data) => {
    setSearchQuery(query)

    if (query.trim() === '') {
      setFilteredSearchData(data)
    } else {
      const filteredResults = data.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(query.toLowerCase()),
        ),
      )
      setFilteredSearchData(filteredResults)
    }
  }

  return (
    <SearchContext.Provider value={{ searchQuery, filteredSearchData, handleSearch }}>
      {children}
    </SearchContext.Provider>
  )
}

// Hook to use Search Context
export const useSearch = () => useContext(SearchContext)
