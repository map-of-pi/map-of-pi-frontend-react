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
import UrlsRemoval from '../../../../util/urlsRemoval';

import { AppContext } from '../../../../../context/AppContextProvider';
import logger from '../../../../../logger.config.mjs';

const SellerRegistrationForm = () => {
  const HEADER = 'font-bold text-lg md:text-2xl';
  const SUBHEADER = 'font-bold mb-2';
  const router = useRouter();
  const t = useTranslations();
  const placeholderSeller = itemData.seller;

  const [formData, setFormData] = useState({
    sellerName: '',
    sellerType: 'Pioneer',
    sellerDescription: '',
    sellerAddress: '',
  });
  const [dbSeller, setDbSeller] = useState<ISeller | null>(null);
  const [userSettings, setUserSettings] = useState<IUserSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<string[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const { currentUser, autoLoginUser } = useContext(AppContext);

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
        sellerType: dbSeller.seller_type || '',
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
    if (files.length === 0) return;
    const objectUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImage(objectUrls);
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

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

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles(Array.from(selectedFiles));
      logger.info('Images selected for upload:', { selectedFiles });
    }
  };

  // Function to save data to the database
  const handleSave = async () => {  
    // Check if user is authenticated and form is valid
    if (!currentUser) {
      logger.warn('Form submission failed: User not authenticated.');
      return toast.error(t('SCREEN.SELLER_REGISTRATION.VALIDATION.REGISTRATION_FAILED_USER_NOT_AUTHENTICATED'));            
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

    const regForm = {
      name: formData.sellerName,
      description: sellerDescription,
      address: sellerAddress,
      seller_type: formData.sellerType,
    } as {
      name: string;
      description: string;
      address: string;
      seller_type: string;
      sell_map_center?: {
        type: 'Point';
        coordinates: [number, number];
      };
    };

    // Add sell_map_center field only if sellCenter is available
    if (sellCenter) {
      regForm.sell_map_center = {
        type: 'Point' as const,
        coordinates: [sellCenter[0], sellCenter[1]] as [number, number]
      };
    }

    try {
      const data = await registerSeller(regForm);
      if (data.seller) {
        setIsSaveEnabled(false);
        setDbSeller(data.seller);
        toast.success(t('SCREEN.SELLER_REGISTRATION.VALIDATION.SUCCESSFUL_REGISTRATION_SUBMISSION'));
        logger.info('Seller registration saved successfully:', { data });
      }
    } catch (error) {
      logger.error('Error saving seller registration:', { error });
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

  const translatedSellerTypeOptions = [
    {
      value: 'Pioneer',
      name: t('SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_OPTIONS.PIONEER'),
    },
    {
      value: 'CurrentlyNotSelling',
      name: t('SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_OPTIONS.CURRENTLY_NOT_SELLING'),
    },
    {
      value: 'TestSeller',
      name: t('SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_OPTIONS.TEST_SELLER'),
    },
    {
      value: 'Other',
      name: t('SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_OPTIONS.OTHER'),
    },
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
        <Button
          label={t('SCREEN.SELLER_REGISTRATION.SELLER_SELL_CENTER')}
          onClick={() => handleNavigation("/map-center")}
          styles={{
            color: '#ffc153',
            height: '40px',
            padding: '10px',
            marginLeft: 'auto',
          }}
        />
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
            <TrustMeter ratings={dbSeller ? dbSeller.trust_meter_rating : placeholderSeller.trust_meter_rating} />
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
            <div className="text-sm mb-7 text-gray-500">
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
                describe={t('SHARED.PHOTO.UPLOAD_PHOTO_PLACEHOLDER')}
                images={[]}
                handleAddImages={handleAddImages}
              />
              {previewImage && (
                <div className="mt-2">
                  <p className="text-sm text-zinc-600">{previewImage}</p>
                </div>
              )}
            </div>
            <div className="mb-5 mt-3 ml-auto w-min">
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
