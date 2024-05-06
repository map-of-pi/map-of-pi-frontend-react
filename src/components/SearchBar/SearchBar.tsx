'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { FormControl, Input, makeStyles } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
// import { Logger } from 'react-logger'; 
import { NGXLogger } from 'ngx-logger';

import './SearchBar.scss';


interface SearchBarProps {
  setSearchQuery: (query: { query: string, searchType: string }) => void;
  setSearchTypeToggled: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ setSearchQuery }) => {
  const [searchBarValue, setSearchBarValue] = useState('');
  const [isBusinessSearchType, setIsBusinessSearchType] = useState(true);
  const { t } = useTranslation();
  // const logger = new Logger();

  const handleSearchBarChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchBarValue(event.target.value);
  };

  const handleIconClick = () => {
    // Move the placeholder text up
    document.getElementById('search-input').focus();
  };

  const handleSubmitSearch = (event: FormEvent) => {
    event.preventDefault();
    const query = searchBarValue;
    if (query !== null) {
      const searchType = isBusinessSearchType ? 'business' : 'product';
      this.logger.info(`Search query emitted for ${searchType}: `, query);
      setSearchQuery({ query, searchType });
    }
  };

  return (
    <div className="w-full min-w-40 fixed top-20 z-5 flex justify-center">
      <div className="w-full max-w-xl pl-14 pr-4 flex items-center">
        <form className="w-full" onSubmit={handleSubmitSearch}>
          <FormControl className="w-full mb-0 flex-grow">
            <TextField 
            id="search-input" 
            type="text" 
            variant="filled"
            color="success"
            className='bg-'
            label={t(
              isBusinessSearchType
                ? 'Search Businesses..'
                : 'Search Products..',
            )} 
            value={searchBarValue} 
            onChange={handleSearchBarChange}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              {isBusinessSearchType ? (
                <StorefrontIcon
                  className="search-toggle-element cursor-pointer"
                  onClick={() => {
                    setIsBusinessSearchType(false);
                    handleIconClick();
                  }}
                />
              ) : (
                <Inventory2Icon
                  className="search-toggle-element cursor-pointer"
                  onClick={() => {
                    setIsBusinessSearchType(true);
                    handleIconClick();
                  }}
                />
              )}
              <IconButton
                aria-label="delete"
                className="bg-gray-600 rounded h-10 w-10 flex items-center justify-center ml-5 hover:bg-gray-600">
                <SearchIcon className="text-white text-2xl mb-1" />
              </IconButton>
            </div>
          </FormControl>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
