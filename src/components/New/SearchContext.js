// SearchContext.js
import React, { createContext, useContext, useState } from 'react'

const SearchContext = createContext()

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchPlaceholder, setSearchPlaceholder] = useState('Search...')
  const [filteredSearchData, setFilteredSearchData] = useState([])

  const setGlobalSearchQuery = (query) => {
    setSearchQuery(query)
  }

  const setGlobalPlaceholder = (placeholder) => {
    setSearchPlaceholder(placeholder)
  }

  const handleSearch = (searchValue, dataToFilter) => {
    if (searchQuery) {
      setFilteredSearchData([])
      return
    }
    
    if (!searchValue || !dataToFilter) {
      setFilteredSearchData(dataToFilter || [])
      return
    }

    const lowercasedSearch = searchValue.toLowerCase()

    const filteredData = dataToFilter.filter((item) => {
      // Search through all string properties of the item
      return Object.values(item).some((value) => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowercasedSearch)
        }
        return false
      })
    })

    setFilteredSearchData(filteredData)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setFilteredSearchData([])
  }

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setGlobalSearchQuery,
        searchPlaceholder,
        setGlobalPlaceholder,
        filteredSearchData,
        handleSearch,
        clearSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = () => useContext(SearchContext)
