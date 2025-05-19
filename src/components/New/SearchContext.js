// SearchContext.js
import { createContext, useContext, useState } from 'react'

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

  const handleSearch = (data) => {
    // ... existing handleSearch implementation
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
        clearSearch 
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = () => useContext(SearchContext)