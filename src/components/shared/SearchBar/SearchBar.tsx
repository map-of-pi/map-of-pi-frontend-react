'use client'

import './SearchBar.scss';

import { useTranslations } from 'next-intl';

import { useState, useRef, ChangeEvent, FormEvent } from 'react';

import { FormControl } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';

import logger from '../../../../logger.config.mjs';

interface searchBarProps {
  onSearch?:(query:string) => void;
  page: 'map_center' | 'default'; 
}

const SearchBar: React.FC<searchBarProps> = ({ onSearch, page }) => {
  const t = useTranslations();
  const [searchBarValue, setSearchBarValue] = useState('');
  const [message, setMessage] = useState('');

  // function to get the placeholder text based on the screen
  const getPlaceholderText = (page: 'map_center' | 'default'): string => {
    switch (page) {
      case 'map_center':
        return t('SHARED.MAP_CENTER.SEARCH_BAR_PLACEHOLDER');
      default:
        return t('HOME.SEARCH_BAR_PLACEHOLDER');
    }
  };
  const placeholder = getPlaceholderText(page);

  const handleSearchBarChange = (event: ChangeEvent<HTMLInputElement>) => {
    logger.debug(`Search bar value changed: ${event.target.value}`);
    setSearchBarValue(event.target.value);
  };
  
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchSearchResults = async (query: string): Promise<any[]> => {
    logger.debug(`Fetching search results for query: "${query}"`);
    // fetch logic to be defined here
    // For now, it returns an empty array
    return new Promise((resolve) => resolve([]));
  };

  const setSearchQuery = (query: string) => {
    // setSearchQuery logic here
  };
  
  const handleSubmitSearch = async (event: FormEvent) => {
    event.preventDefault();
    const query = searchBarValue;
    if (query) {
      logger.info(`Search query submitted: ${query}`);
      
      if (onSearch) {
        onSearch(query);
      } else {
        // Default search handling
        const searchResults = await fetchSearchResults(query);
        setSearchQuery(query);
        logger.info(`Your search found ${searchResults.length} shops`);
      }
    } else {
      logger.warn('Search query is empty');
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
              label={ placeholder }
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
