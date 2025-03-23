'use client';

import './SearchBar.scss';

import { useTranslations } from 'next-intl';
import { useContext, useState, ChangeEvent, FormEvent } from 'react';
import { FormControl, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import logger from '../../../../logger.config.mjs';
import { AppContext } from '../../../../context/AppContextProvider';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  page: 'map_center' | 'default';
  setSearchResults?: (value: any[]) => void;
  setSearchQuery?: (value: string) => void;
  setSearchClicked?: (value: boolean) => void;
  isSearchClicked?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  page, 
  setSearchResults = () => {}, 
  setSearchQuery = () => {}, 
  setSearchClicked = () => {},
  isSearchClicked
}) => {
  const t = useTranslations();

  const [searchBarValue, setSearchBarValue] = useState('');
  const { isSigningInUser } = useContext(AppContext);

  const getPlaceholderText = (page: 'map_center' | 'default'): string => {
    return page === 'map_center'
      ? t('SHARED.MAP_CENTER.SEARCH_BAR_PLACEHOLDER')
      : t('HOME.SEARCH_BAR_PLACEHOLDER');
  };

  const placeholder = getPlaceholderText(page);

  const handleSearchBarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    logger.debug(`Search bar value changed: ${event.target.value}`);
    setSearchBarValue(event.target.value);

    if (isSearchClicked !== undefined && isSearchClicked && newValue.trim() === '') {
      setSearchClicked(false);
      setSearchResults([]); // Reset results
      setSearchQuery(''); // Reset query
    }
  };

  const handleSubmitSearch = (event: FormEvent) => {
    event.preventDefault();
    const query = searchBarValue.trim();
    logger.debug(`Search query submitted: ${query}`);
    if (onSearch) {
      onSearch(query); // Pass the query to the parent component
    }
  };

  return (
    <div className="w-[90%] m-auto left-0 right-0 max-w-[504px] fixed top-[120px] z-10 flex">
      <div className="w-[100%] m-auto flex items-center">
        <form
          className="w-full flex items-center gap-2 justify-between"
          onSubmit={handleSubmitSearch}
        >
          <FormControl className="flex-grow mr-3">
            <TextField
              id="search-input"
              type="text"
              variant="outlined"
              color="success"
              className={`w-full rounded ${
                isSigningInUser ? 'bg-gray-200' : 'bg-white hover:bg-gray-100'
              }`}
              label={isSigningInUser ? '' : placeholder}
              value={searchBarValue}
              onChange={handleSearchBarChange}
              disabled={isSigningInUser}
              InputLabelProps={{ className: 'custom-label' }}
            />
          </FormControl>
          <button
            aria-label="search"
            type="submit"
            className={`rounded-[10px] h-[55px] w-[55px] flex items-center justify-center 
              ${isSigningInUser ? 'bg-tertiary' : 'bg-primary hover:bg-gray-500'}`}
            disabled={isSigningInUser}
          >
            <SearchIcon fontSize={'large'} className="text-[#ffc153]" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
