'use client';

import './SearchBar.scss';

import { useTranslations } from 'next-intl';
import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { FormControl, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { fetchSellers } from '@/services/sellerApi';

import logger from '../../../../logger.config.mjs';

interface searchBarProps {
  onSearch?: (query: string, results: any[]) => void;
  page: 'map_center' | 'default';
}

const SearchBar: React.FC<searchBarProps> = ({ onSearch, page }) => {
  const t = useTranslations();

  const [searchBarValue, setSearchBarValue] = useState('');
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const getPlaceholderText = (page: 'map_center' | 'default'): string => {
    return page === 'map_center'
      ? t('SHARED.MAP_CENTER.SEARCH_BAR_PLACEHOLDER')
      : t('HOME.SEARCH_BAR_PLACEHOLDER');
  };

  const placeholder = getPlaceholderText(page);

  const handleSearchBarChange = (event: ChangeEvent<HTMLInputElement>) => {
    logger.debug(`Search bar value changed: ${event.target.value}`);
    setSearchBarValue(event.target.value);
  };

  const fetchSearchResults = async (query: string): Promise<any[]> => {
    setLoading(true);
    try {
      logger.debug(`Fetching search results for query: "${query}"`);
      const data = await fetchSellers(undefined, undefined, query);
      return data || []; // Return response.data or empty array if undefined
    } catch (error) {
      logger.error(`Error fetching search results: ${ error }`);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSearch = async (event: FormEvent) => {
    event.preventDefault();
    const query = searchBarValue.trim();
    logger.debug(`Search query submitted: ${query}`);
    const results = await fetchSearchResults(query);
    if (onSearch) {
      onSearch(query, results);  // notify parent of the search query to update map
    }
  };

  return (
    <div className="w-[90%] m-auto left-0 right-0 max-w-[504px] fixed top-[120px] z-10 flex">
      <div className="w-[100%] m-auto flex items-center">
        <form className="w-full flex items-center gap-2 justify-between" onSubmit={handleSubmitSearch}>
          <FormControl className="flex-grow mr-3">
            <TextField
              id="search-input"
              type="text"
              variant="outlined"
              color="success"
              className="bg-white hover:bg-gray-100 w-full rounded"
              label={placeholder}
              value={searchBarValue}
              onChange={handleSearchBarChange}
              ref={inputRef}
            />
          </FormControl>
          <button
            aria-label="search"
            type="submit"
            className="bg-primary rounded h-full w-15 p-[15.5px] flex items-center justify-center hover:bg-gray-600"
          >
            <SearchIcon className="text-[#ffc153]" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
