'use client';

import './SearchBar.scss';
import { useState, useRef, ChangeEvent, FormEvent, useEffect } from 'react';
import { FormControl, Snackbar, TextField, CircularProgress, Modal } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import logger from '../../../../logger.config.mjs';
import axios from 'axios';

interface searchBarProps {
  onSearch?: (query: string) => void;
  page: 'map_center' | 'default';
}

const SearchBar: React.FC<searchBarProps> = ({ onSearch, page }) => {
  const [searchBarValue, setSearchBarValue] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]); // Initialize as empty array
  const [openModal, setOpenModal] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const getPlaceholderText = (page: 'map_center' | 'default'): string => {
    return page === 'map_center'
      ? 'Search sellers around the map'
      : 'Search for sellers';
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
      const response = await axios.get(`/api/v1/sellers/search/${query}`);
      return response.data || []; // Return response.data or empty array if undefined
    } catch (error) {
      logger.error(`Error fetching search results: ${error}`);
      setMessage('Error fetching search results');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSearch = async (event: FormEvent) => {
    event.preventDefault();
    const query = searchBarValue.trim();

    if (query) {
      logger.info(`Search query submitted: ${query}`);

      if (onSearch) {
        onSearch(query);
      } else {
        const results = await fetchSearchResults(query);
        setSearchResults(results);
        setOpenModal(true); // Open modal with search results
      }
    } else {
      logger.warn('Search query is empty');
      setMessage('Please enter a search term');  // Set prompt when empty search
      setOpenModal(true); // Open modal to display error message
    }
  };

  const getSellersMessage = (): string => {
    const sellersCount = searchResults.length;

    if (sellersCount === 0) {
      return 'Your search did not find any sellers around your area.';
    }

    // Message if sellers are found
    return `There are ${sellersCount} sellers around your location. Zoom out to view their map markers.`;
  };

  // Automatically close modal after 3 seconds
  useEffect(() => {
    if (openModal) {
      const timer = setTimeout(() => {
        setOpenModal(false);
      }, 3000); // Auto-hide after 3 seconds

      return () => clearTimeout(timer); // Clear timer on component unmount or if modal closes early
    }
  }, [openModal]);

  return (
    <div className="w-[90%] m-auto left-0 right-0 max-w-[504px] fixed top-[120px] z-10 flex">
      {/* Snackbar for showing messages on top of the search bar */}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={!!message}
        message={message}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
        sx={{ top: '10px', zIndex: 1500 }} // Positioning above the search bar
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
              label={placeholder}
              value={searchBarValue}
              onChange={handleSearchBarChange}
              ref={inputRef}
            />
          </FormControl>
          <button
            aria-label="search"
            type="submit"  // Add submit type for accessibility
            className="bg-primary rounded h-full w-15 p-[15.5px] flex items-center justify-center hover:bg-gray-600"
          >
            <SearchIcon className="text-[#ffc153]" />
          </button>
        </form>
      </div>

      {/* Non-blocking Modal for displaying search results */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        BackdropProps={{
          style: { backgroundColor: 'transparent' }, // Transparent backdrop to make modal non-blocking
        }}
        aria-labelledby="search-results-title"
        aria-describedby="search-results-description"
      >
        <div className="modal-container">
          {loading ? (
            <CircularProgress />
          ) : (
            <p
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark background
                color: 'white', // White text color
                padding: '20px', // Padding for the message box
                borderRadius: '8px', // Rounded corners
                textAlign: 'center', // Centered text
                position: 'absolute', // Absolute position for modal content
                top: '80px', // Just above the search bar
                left: '50%', // Center it horizontally
                transform: 'translateX(-50%)', // Adjust position to exactly center horizontally
                zIndex: 1500 // Ensure it's on top of other elements
              }}
            >
              {getSellersMessage()}
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default SearchBar;
