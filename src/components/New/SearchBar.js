import React, { useState, useEffect, useImperativeHandle , forwardRef} from 'react';
import { useSearch } from './SearchContext';
import { IoSearch } from 'react-icons/io5';

const SearchBar = forwardRef(({ text, data }, ref) => {
  const { handleSearch, clearSearch: contextClearSearch } = useSearch();
  const [query, setQuery] = useState('');
  const [debounceTimer, setDebounceTimer] = useState(null);

  useImperativeHandle(ref, () => ({
    clearSearch: () => {
      setQuery('');
      contextClearSearch()
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    }
  }));
  const handleChange = (event) => {
    const newQuery = event.target.value;
    setQuery(newQuery);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    setDebounceTimer(
      setTimeout(() => {
        handleSearch(newQuery, data);
      }, 500)
    );
  };

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return (
    <div>
      <div className="flex items-center h-[35px] w-[300px] gap-[2px] border border-gray-300 rounded-md">
        <div className="bg-white h-full w-10 flex justify-center items-center rounded-l-md border-r-[1px]">
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
  );
});

export default SearchBar;