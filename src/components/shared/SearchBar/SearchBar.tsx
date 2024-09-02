'use client'

import './SearchBar.scss';

import { useTranslations } from 'next-intl';

import { useState, useRef, ChangeEvent, FormEvent } from 'react';

import { FormControl } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';

import logger from '../../../../logger.config.mjs';

// Define the props that can be passed to searchBar component.
// onSearch: Optional callback from the parent for custom search handling.
interface searchBarprops {
  onSearch?:(query:string) => void;
  placeholder?: string; 
}

const SearchBar: React.FC<searchBarprops> = ({onSearch}) => { // Update the component definition to accept props
  const t = useTranslations();

  const [searchBarValue, setSearchBarValue] = useState('');
  const [isBusinessSearchType, setIsBusinessSearchType] = useState(true);
  const [message, setMessage] = useState('');

  const handleSearchBarChange = (event: ChangeEvent<HTMLInputElement>) => {
    logger.debug(`Search bar value changed: ${event.target.value}`);
    setSearchBarValue(event.target.value);
  };
  
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchSearchResults = async (query: string, searchType: string):Promise<any[]> => {
    logger.info(`Fetching search results for query: ${query}, searchType: ${searchType}`);
    // fetch logic to be defined here
    // For now, it returns an empty array
    return new Promise((resolve) => resolve([]));
  };

  const setSearchQuery = (query: string, searchType: string) => {
    // setSearchQuery logic here
  };
  
  const handleSubmitSearch = async (event: FormEvent) => {
    event.preventDefault();
    const query = searchBarValue;
    if (query) {
      const searchType = isBusinessSearchType ? 'business' : 'product';
      logger.info(`Search query emitted for ${searchType}: ${query}`);
      
      if (onSearch) {
        // Use custom search handler if provided via props
        onSearch(query);
        setMessage(`Search submitted for: ${query}`);
      } else {
        // Default search handling
        const searchResults = await fetchSearchResults(query, searchType);
        setSearchQuery(query, searchType);
        setMessage(`Your search found ${searchResults.length} shops. Please zoom out to view all shop markers.`);
      }
      logger.info(message);
    } else {
      logger.warn('Search query is empty.');
    }
  };

  return (
    <div className="w-[90%] m-auto left-0 right-0 max-w-[504px] fixed top-[120px] z-10 flex">
       <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={!!message}
        message={message}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
      />
      <div className="w-[100%] m-auto flex items-center">
        <form className="w-full flex items-center gap-2 justify-between" onSubmit={handleSubmitSearch}>
          <FormControl className="flex-grow mr-3">
            <TextField 
              id="search-input" 
              type="text" 
              variant="outlined"
              color="success"
              className="bg-white hover:bg-gray-100 w-full rounded"
              value={searchBarValue} 
              onChange={handleSearchBarChange}
              ref={inputRef}
            />
          </FormControl>
          <button
            aria-label="search"
            className="bg-primary rounded h-full w-15 p-[15.5px] flex items-center justify-center hover:bg-gray-600" 
            // onClick={handleSubmitSearch} style={{backgroundColor: 'red'}}
            >
            <SearchIcon className="text-[#ffc153]" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
