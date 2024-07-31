'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useState, useEffect, useContext } from 'react';

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
import { itemData } from '@/constants/demoAPI';
import { SellerType } from '@/constants/types';
import { fetchSellerRegistration, registerSeller } from '@/services/sellerApi';

import { AppContext } from '../../../../../context/AppContextProvider';
import { autoSigninUser } from '@/util/auth';

interface Seller {
  seller_id: string;
  name: string;
  description: string;
  image: string;
  address: string;
  phone: string;
  email: string;
  sale_items: string;
  average_rating: number;
  trust_meter_rating: number;
  type: string;
  coordinates: number [];
  order_online_enabled_pref: boolean;
};

const SellerRegistrationForm = () => {
  const HEADER = 'mb-5 font-bold text-lg md:text-2xl';
  const SUBHEADER = 'font-bold mb-2';

  const t = useTranslations();
  const router = useRouter();
  const placeholderSeller = itemData.seller;

  const [formData, setFormData] = useState({
    itemsForSale: '',
    sellerName: '',
    sellerType: 'Pioneer',
    sellerDescription: '',
    sellerAddress: '',
  });
  const [dbSeller, setDbSeller] = useState<SellerType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<string[]>([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const { currentUser, registerUser } = useContext(AppContext);

  useEffect(() => {
    if (!currentUser) {
      console.log("Not logged in; pending login attempt..");
      autoSigninUser();
    }

    const getSellerData = async () => {
      try {
        const data = await fetchSellerRegistration();
        if (data) {
          console.log('Seller data:', data);
          setDbSeller(data); // Ensure this is a single object, not an array
        } else {
          console.log('Seller not found');
          setDbSeller(null); // Set placeholder seller
        }
      } catch (error) {
        console.error('Error fetching seller data: ', error);
        setError('Error fetching seller data');
      } finally {
        setLoading(false);
      }
    };

    getSellerData();
  }, []);

  useEffect(() => {
    const {
      itemsForSale,
      sellerName,
      sellerDescription,
      sellerAddress,
    } = formData;
    setIsFormValid(
      !!(
        itemsForSale &&
        sellerName &&
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
    setFormData({ ...formData, [name]: value });
    if (value !== '' && formData) {
      setIsSaveEnabled(true);
    } else {
      setIsSaveEnabled(false);
    }
  };

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles(Array.from(selectedFiles));
    }
  };

  // Function to save data to the database
  const handleSave = async () => {  
    // check if user is authenticated and form is valid
    if (!currentUser || !isFormValid) {
      console.log('Form submission failed');
      return window.alert(t('SCREEN.SELLER_REGISTRATION.VALIDATION.REGISTRATION_FAILED_USER_NOT_AUTHENTICATED'));            
    }
    
    const sellCenter = JSON.parse(localStorage.getItem('mapCenter') || 'null');

    const sell_map_center = sellCenter
      ? {
          type: 'Point' as const,
          coordinates: [sellCenter[0], sellCenter[1]] as [number, number],
        }
      : {
          type: 'Point' as const,
          coordinates: [0, 0] as [number, number], // Provide a default coordinate if searchCenter is not found
        };

    const regForm = {
      name: formData.sellerName,
      description: formData.sellerDescription,
      address: formData.sellerAddress,
      sale_items: formData.itemsForSale,
      seller_type: formData.sellerType,
      sell_map_center: sell_map_center
    }    
    console.log('registration form', regForm);

    try {
      await registerSeller(regForm);
    } catch (error) {
      console.error('Error saving seller registration: ', error);
    }
  }

  const translateSellerCategory = (category: string): string => {
    switch (category) {
      case 'Pioneer':
        return t(
          'SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_OPTIONS.PIONEER',
        );
      case 'Other':
        return t(
          'SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_OPTIONS.OTHER',
        );
      default:
        return category;
    }
  };

  return (
    <>
      <div className="w-full md:w-[500px] md:mx-auto p-4">
        <h1 className={HEADER}>
          {t('SCREEN.SELLER_REGISTRATION.SELLER_REGISTRATION_HEADER')}
        </h1>

        <div className="mb-4">
          <h2 className={SUBHEADER}>
            {t('SCREEN.SELLER_REGISTRATION.SELLER_SALE_ITEMS_LABEL')}
          </h2>
          <div className="mb-2">
            <TextArea
              name="itemsForSale"
              placeholder={t(
                'SCREEN.SELLER_REGISTRATION.SELLER_SALE_ITEMS_PLACEHOLDER',
              )}
              value={formData.itemsForSale}
              onChange={handleChange}
              styles={{height: '200px'}}
            />
          </div>
        </div>
        <Link href="/map-center">
          <Button
            label={t('SHARED.SEARCH_CENTER')}
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
        <ToggleCollapse
          header={t('SCREEN.SELLER_REGISTRATION.REVIEWS_SUMMARY_LABEL')}>
          <TrustMeter ratings={dbSeller ? dbSeller.trust_meter_rating : placeholderSeller.trust_meter_rating} />
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm">
              {t('SCREEN.BUY_FROM_SELLER.REVIEWS_SCORE_MESSAGE', {
                seller_review_rating: dbSeller ? dbSeller.trust_meter_rating: placeholderSeller.trust_meter_rating,
              })}
            </p>
            <Link href={dbSeller ? `/seller/reviews/${dbSeller.seller_id}`: '#'}>
              <OutlineBtn
                disabled={!currentUser}
                label={t('SHARED.CHECK_REVIEWS')}
              />
            </Link>
          </div>
        </ToggleCollapse>
        <ToggleCollapse
          header={t('SCREEN.BUY_FROM_SELLER.SELLER_CONTACT_DETAILS_LABEL')}>
          <div className="text-sm mb-3">
            <span className="font-bold">
              {t('SCREEN.BUY_FROM_SELLER.SELLER_PI_ID_LABEL') + ': '}
            </span>
            <span>{dbSeller ? dbSeller.seller_id : ''}</span>
          </div>
          <div className="text-sm mb-3">
            <span className="font-bold">
              {t('SCREEN.BUY_FROM_SELLER.SELLER_PHONE_LABEL') + ': '}
            </span>
            <span>{dbSeller ? dbSeller.name : placeholderSeller.phone}</span>
          </div>
          <div className="text-sm mb-3">
            <span className="font-bold">
              {t('SCREEN.BUY_FROM_SELLER.SELLER_EMAIL_LABEL') + ': '}
            </span>
            <span>{dbSeller ? dbSeller.name : placeholderSeller.email}</span>
          </div>
        </ToggleCollapse>
        <ToggleCollapse header={t('SCREEN.SELLER_REGISTRATION.SELLER_SETTINGS_LABEL')}>
        <div className="mb-4">
          <Input
            label={t('SCREEN.SELLER_REGISTRATION.SELLER_NAME')}
            name="sellerName"
            placeholder="business name"
            type="text"
            value={formData.sellerName}
            onChange={handleChange}
          />

          <Select
            label={t(
              'SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_LABEL',
            )}
            name="sellerType"
            value={translateSellerCategory(formData.sellerType)}
            onChange={handleChange}
            options={[
              {
                value: t(
                  'SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_OPTIONS.PIONEER',
                ),
                name: 'Pioneer',
              },
              {
                value: t(
                  'SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_OPTIONS.OTHER',
                ),
                name: 'Other',
              },
            ]}
          />

          <TextArea
            label={t('SCREEN.SELLER_REGISTRATION.SELLER_DESCRIPTION')}
            name="sellerDescription"
            placeholder="I sell test items for pay with Pi"
            value={formData.sellerDescription}
            onChange={handleChange}
          />

          <TextArea
            label={t(
              'SCREEN.SELLER_REGISTRATION.SELLER_ADDRESS_LOCATION_LABEL',
            )}
            name="sellerAddress"
            placeholder={t(
              'SCREEN.SELLER_REGISTRATION.SELLER_ADDRESS_LOCATION_PLACEHOLDER',
            )}
            value={formData.sellerAddress}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <FileInput
            label={t('SHARED.PHOTO.UPLOAD_PHOTO_LABEL')}
            images={[]}
            handleAddImages={handleAddImages}
          />
          {previewImage && (
            <div className="mt-2">
              <p className="text-sm text-zinc-600">{previewImage}</p>
            </div>
          )}
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