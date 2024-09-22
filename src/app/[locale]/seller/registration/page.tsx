'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';

import TrustMeter from '@/components/shared/Review/TrustMeter';
import { OutlineBtn, Button } from '@/components/shared/Forms/Buttons/Buttons';
import {
  FileInput,
  TextArea,
  Input,
  Select,
} from '@/components/shared/Forms/Inputs/Inputs';
import ConfirmDialog from '@/components/shared/confirm';
import ToggleCollapse from '@/components/shared/Seller/ToggleCollapse';
import Skeleton from '@/components/skeleton/skeleton';
import { itemData } from '@/constants/demoAPI';
import { IUserSettings, ISeller } from '@/constants/types';
import { sellerDefault } from '@/constants/placeholders';
import { fetchSellerRegistration, registerSeller } from '@/services/sellerApi';
import { fetchUserSettings } from '@/services/userSettingsApi';
import UrlsRemoval from '../../../../utils/sanitize';

import { AppContext } from '../../../../../context/AppContextProvider';
import logger from '../../../../../logger.config.mjs';
import { fetchMapCenter } from '@/services/mapCenterApi';

const SellerRegistrationForm = () => {
  const HEADER = 'font-bold text-lg md:text-2xl';
  const SUBHEADER = 'font-bold mb-2';
  const router = useRouter();
  const t = useTranslations();
  const placeholderSeller = itemData.seller;
  
  const {currentUser, autoLoginUser} = useContext(AppContext);
  
const [sellCenter, setSellCenter] = useState<{ lat: number; lng: number } | null>(null);
const [formData, setFormData] = useState({
  sellerName: '',
  sellerType: 'Test seller',
  sellerDescription: '',
  sellerAddress: '',
  image: ''
});
const [dbSeller, setDbSeller] = useState<ISeller | null>(null);
const [userSettings, setUserSettings] = useState<IUserSettings | null>(null);
const [loading, setLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);
const [file, setFile] = useState<File | null>(null);
const [previewImage, setPreviewImage] = useState<string>(dbSeller?.image || '');
const [isFormValid, setIsFormValid] = useState(false);
const [isSaveEnabled, setIsSaveEnabled] = useState(false);
const [showConfirmDialog, setShowConfirmDialog] = useState(false);
const [linkUrl, setLinkUrl] = useState('');

useEffect(() => {
  const fetchSellCenter = async () => {
    try {
      const mapCenterData = await fetchMapCenter(); // Function to fetch map center from backend
      if (mapCenterData) {
        const { latitude, longitude } = mapCenterData;
        if (latitude !== undefined && longitude !== undefined) {
          setSellCenter({ lat: latitude, lng: longitude });
          logger.info('Fetched sellCenter from backend:', { lat: latitude, lng: longitude });
        } else {
          logger.warn('Latitude or longitude is undefined in mapCenterData.');
        }
      } else {
        logger.warn('No sell_map_center found for the user.');
      }
    } catch (error) {
      logger.error('Error fetching sellCenter from backend:', error);
    }
  };

  fetchSellCenter();
}, [currentUser]);

// Fetch seller data and user settings on component mount
useEffect(() => {
  if (!currentUser) {
    logger.info("User not logged in; attempting auto-login..");
    autoLoginUser();
  }

  const getSellerData = async () => {
    try {
      const data = await fetchSellerRegistration();
      if (data) {
        logger.info('Fetched seller data successfully:', { data });
        setDbSeller(data);
      } else {
        logger.warn('Seller not found.');
        setDbSeller(null);
      }
    } catch (error) {
      logger.error('Error fetching seller data:', { error });
      setError('Error fetching seller data.');
    } finally {
      setLoading(false);
    }
  };

  const getUserSettings = async () => {
    const settings = await fetchUserSettings();
    if (settings) {
      logger.info('Fetched user settings successfully:', {settings});
      setUserSettings(settings);
    } else {
      logger.info('User settings not found.');
      setUserSettings(null);
    }
  };

  getSellerData();
  getUserSettings();
}, [currentUser]);

const defaultSellerName = currentUser? currentUser?.user_name : '';
// Initialize formData with dbSeller values if available
useEffect(() => {
  if (dbSeller) {
    setFormData({
      sellerName: dbSeller.name || defaultSellerName,
      sellerDescription: dbSeller.description || '',
      sellerAddress: dbSeller.address || '',
      sellerType: dbSeller.seller_type || 'Test seller',
      image: dbSeller.image || ''
    });
  }
}, [dbSeller]);

useEffect(() => {
  const {
    sellerName,
    sellerType,
    sellerDescription,
    sellerAddress
  } = formData;
  setIsFormValid(
    !!(
      sellerName &&
      sellerType &&
      sellerDescription &&
      sellerAddress
    ),
  );
}, [formData]);

// function preview image upload
useEffect(() => {
  if (!file) return;
  const objectUrl = URL.createObjectURL(file);
  setPreviewImage(objectUrl);
  return () => {
    URL.revokeObjectURL(objectUrl);
  };
}, [file]);

// set the preview image if dbSeller changes
useEffect(() => {
  if (dbSeller?.image) {
    setPreviewImage(dbSeller.image);
  }
}, [dbSeller]);

const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >,
) => {
  const { name, value } = e.target;
  setFormData(prevFormData => ({
    ...prevFormData,
    [name]: value,
  }));
  
  // enable or disable save button based on form inputs
  const isFormFilled = Object.values(formData).some(v => v !== '');
  setIsSaveEnabled(isFormFilled);
};

const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = e.target.files?.[0]; // only take the first file
  if (selectedFile) {
    setFile(selectedFile);

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewImage(objectUrl);
    logger.info('Image selected for upload:', { selectedFile });

    setIsSaveEnabled(true);
  }
};


const handleNavigation = (nextLink: string)=> {
  setLinkUrl(nextLink);
  
  if (isSaveEnabled) {
    setShowConfirmDialog(true); // Show confirm dialog when save is enabled
  } else {
    router.push(nextLink); // Direct navigation if save is not enabled
  }
}

// Function to save data to the database
const handleSave = async () => {  
  // Check if user is authenticated and form is valid
  if (!currentUser) {
    logger.warn('Form submission failed: User not authenticated.');
    return toast.error(t('SHARED.VALIDATION.SUBMISSION_FAILED_USER_NOT_AUTHENTICATED'));            
  }
  
  const sellCenter = JSON.parse(localStorage.getItem('mapCenter') as string);
  logger.info('Saving form data:', { formData, sellCenter });

  // Trim and clean the sellerAddress and sellerDescription fields
  let sellerAddress = formData.sellerAddress.trim() === "" 
    ? sellerDefault.address 
    : UrlsRemoval(formData.sellerAddress);

  let sellerDescription = formData.sellerDescription.trim() === "" 
    ? sellerDefault.description 
    : UrlsRemoval(formData.sellerDescription);

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.sellerName);
    formDataToSend.append('seller_type', formData.sellerType);
    formDataToSend.append('description', sellerDescription);
    formDataToSend.append('address', sellerAddress);
    // hardcode the value until the form element is built
    formDataToSend.append('order_online_enabled_pref', 'false');


  // Add sell_map_center field only if sellCenter is available
  if (sellCenter) {
    formDataToSend.append('sell_map_center', JSON.stringify({
      type: 'Point',
      coordinates: [sellCenter[0], sellCenter[1]]
    }));
  };
  
  // add the image if it exists
  if (file) {
    formDataToSend.append('image', file);
  } else {
    formDataToSend.append('image', '');
  }

  logger.info('Registration form data:', Object.fromEntries(formDataToSend.entries()));

  try {
    const data = await registerSeller(formDataToSend);
    if (data.seller) {
      setDbSeller(data.seller);
      setIsSaveEnabled(false);
      logger.info('Seller registration saved successfully:', { data });
      toast.success(t('SCREEN.SELLER_REGISTRATION.VALIDATION.SUCCESSFUL_REGISTRATION_SUBMISSION'));
    }
  } catch (error) {
    logger.error('Error saving seller registration:', { error });
  }
};

const translatedSellerTypeOptions = [
  {
    value: 'activeSeller',
    name: t('SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_OPTIONS.ACTIVE_SELLER'),
  },
  {
    value: 'inactiveSeller',
    name: t('SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_OPTIONS.INACTIVE_SELLER'),
  },
  {
    value: 'testSeller',
    name: t('SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_OPTIONS.TEST_SELLER'),
  }
];

if (loading) {
  logger.info('Loading Seller Registration Form.');
  return (
    <Skeleton type='seller_registration' />
  );
}

return (
  <>
    <div className="w-full md:w-[500px] md:mx-auto p-4">
      <div className='text-center mb-5'>          
        <h3 className='text-gray-400 text-sm'>{dbSeller? dbSeller.name : ""}</h3>
        <h1 className={HEADER}>
          {t('SCREEN.SELLER_REGISTRATION.SELLER_REGISTRATION_HEADER')}
        </h1>
        <p className='text-gray-400 text-sm'>{dbSeller? dbSeller.seller_type: ""}</p>
      </div>
      
      <div className="mb-4">
        <h2 className={SUBHEADER}>
          {t('SCREEN.SELLER_REGISTRATION.SELLER_DETAILS_LABEL')}
        </h2>
        <p className='text-gray-400 text-sm'>{t('SCREEN.SELLER_REGISTRATION.SELLER_DETAILS_PLACEHOLDER')}</p>
        <div className="mb-2">
          <TextArea
            name="sellerDescription"
            value={formData.sellerDescription}
            onChange={handleChange}
            styles={{ height: '200px' }}
          />
        </div>
      </div>
      <Link
        href={{
          pathname: "/map-center", // Path to MapCenter component
          query: { entryType: 'sell' } // Passing 'sell' as entryType
        }}
      >
        <Button
          label={t('SCREEN.SELLER_REGISTRATION.SELLER_SELL_CENTER')}
          styles={{
            color: '#ffc153',
            height: '40px',
            padding: '10px',
            marginLeft: 'auto',
          }}
        />
      </Link>
      <div className="mb-4 mt-3 ml-auto w-min">
        <Button
          label={t('SHARED.SAVE')}
          disabled={!isSaveEnabled}
          styles={{
            color: '#ffc153',
            height: '40px',
            padding: '10px 15px',
          }}
          onClick={handleSave}
        />
      </div>
      <div className='spacing-7'>
        {/* seller review toggle */}
        <ToggleCollapse
          header={t('SCREEN.SELLER_REGISTRATION.REVIEWS_SUMMARY_LABEL')}>
          <TrustMeter ratings={userSettings ? userSettings.trust_meter_rating : placeholderSeller.trust_meter_rating} />
          <div className="flex items-center justify-between mt-3 mb-5">
            <p className="text-sm">
              {t('SCREEN.BUY_FROM_SELLER.REVIEWS_SCORE_MESSAGE', {
                seller_review_rating: dbSeller ? dbSeller.average_rating.$numberDecimal : placeholderSeller.average_rating
              })}
            </p>
            { !isSaveEnabled ? (
              <Link href={dbSeller ? `/seller/reviews/${dbSeller.seller_id}` : '#'}>
                <OutlineBtn
                  disabled={!currentUser}
                  label={t('SHARED.CHECK_REVIEWS')}
                />
              </Link> ) : (
                <OutlineBtn
                  disabled={!currentUser}
                  label={t('SHARED.CHECK_REVIEWS')}
                  onClick={()=>handleNavigation(dbSeller ? `/seller/reviews/${dbSeller.seller_id}` : '#')}
                /> )
            }
          </div>
        </ToggleCollapse>
        
        {/* user settings info toggle */}
        <ToggleCollapse
          header={t('SCREEN.BUY_FROM_SELLER.SELLER_CONTACT_DETAILS_LABEL')}>
          <div className="text-sm mb-3">
            <span className="font-bold">
              {t('SHARED.USER_INFORMATION.PI_USERNAME_LABEL') + ': '}
            </span>
            <span>{currentUser ? currentUser.pi_username : ''}</span>
          </div>
          <div className="text-sm mb-3">
            <span className="font-bold">
              {t('SHARED.USER_INFORMATION.NAME_LABEL') + ': '}
            </span>
            <span>{currentUser ? currentUser.user_name : ''}</span>
          </div>
          <div className="text-sm mb-3">
            <span className="font-bold">
              {t('SHARED.USER_INFORMATION.PHONE_NUMBER_LABEL') + ': '}
            </span>
            <span>{userSettings ? userSettings.phone_number : ""}</span>
          </div>
          <div className="text-sm mb-5">
            <span className="font-bold">
              {t('SHARED.USER_INFORMATION.EMAIL_LABEL') + ': '}
            </span>
            <span>{ userSettings ? userSettings.email : ""}</span>
          </div>
        </ToggleCollapse>
        
        {/* seller registration form fields toggle */}
        <ToggleCollapse header={t('SCREEN.SELLER_REGISTRATION.SELLER_ADVANCED_SETTINGS_LABEL')}>
          <div className="mb-4">
            <Input
              label={t('SCREEN.SELLER_REGISTRATION.SELLER_RETAIL_OUTLET_NAME')}
              name="sellerName"                
              type="text"
              value={formData.sellerName}
              onChange={handleChange}
            />

            <Select
              label={t('SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_LABEL')}
              name="sellerType"
              value={formData.sellerType}
              onChange={handleChange}
              options={translatedSellerTypeOptions}
            />
            <TextArea
              label={t('SCREEN.SELLER_REGISTRATION.SELLER_ADDRESS_LOCATION_LABEL')}
              describe={t('SCREEN.SELLER_REGISTRATION.SELLER_ADDRESS_LOCATION_PLACEHOLDER')}
              name="sellerAddress"                
              value={formData.sellerAddress}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <FileInput
              label={t('SHARED.PHOTO.MISC_LABELS.SELLER_IMAGE_LABEL')}
              imageUrl={ previewImage }
              handleAddImage={handleAddImage}
            />
          </div>
          <div className="mb-4 mt-3 ml-auto w-min">
            <Button
              label={t('SHARED.SAVE')}
              disabled={!isSaveEnabled}
              styles={{
                color: '#ffc153',
                height: '40px',
                padding: '10px 15px',
              }}
              onClick={handleSave}
            />
          </div>
        </ToggleCollapse>
      </div>
      <ConfirmDialog
        show={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={setShowConfirmDialog}
        message={t('SHARED.CONFIRM_DIALOG')}
        url={linkUrl}
      />
    </div>
  </>
);
};

export default SellerRegistrationForm;