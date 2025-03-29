'use client';

import { useTranslations } from 'next-intl';
import { useContext, useState, ChangeEvent, FormEvent } from 'react';
import { FormControl, TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import logger from '../../../../logger.config.mjs';
import { AppContext } from '../../../../context/AppContextProvider';
import MyLocationIcon from '@mui/icons-material/MyLocation';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  page: 'map_center' | 'default';
  setSearchResults?: (value: any[]) => void;
  setSearchQuery?: (value: string) => void;
  setSearchClicked?: (value: boolean) => void;
  isSearchClicked?: boolean;
  handleLocationButtonClick?: (value: boolean) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  page, 
  setSearchResults = () => {}, 
  setSearchQuery = () => {}, 
  setSearchClicked = () => {},
  isSearchClicked,
  handleLocationButtonClick = () => {},
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
    logger.debug(`Search bar value changed: ${newValue}`);
    setSearchBarValue(newValue);

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
    <div className="w-[100%] m-auto p-5 fixed top-1 z-10 flex">
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
              className={`w-full rounded-[10px] ${
                isSigningInUser ? 'bg-gray-200' : 'bg-white hover:bg-gray-100'
              }`}
              label={isSigningInUser ? '' : placeholder}
              value={searchBarValue}
              onChange={handleSearchBarChange}
              disabled={isSigningInUser}
              InputLabelProps={{ className: 'custom-label' }}
            />
          </FormControl>
          <IconButton
            aria-label="search"
            type="submit"
            className={`rounded-[10px] h-[55px] w-[55px] flex items-center justify-center 
              ${isSigningInUser ? 'bg-primary' : 'bg-primary hover:bg-gray-500'}`}          >
            <SearchIcon />
          </IconButton>
          <IconButton
            aria-label="mylocation"
            onClick={handleLocationButtonClick}
            className={`rounded-[10px] h-[55px] w-[55px] flex items-center justify-center 
              ${isSigningInUser ? 'bg-primary' : 'bg-primary hover:bg-gray-500'}`}          >
            <MyLocationIcon />
          </IconButton>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
