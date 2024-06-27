'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useState, useEffect } from 'react';

import TrustMeter from '@/components/shared/Review/TrustMeter';
import { OutlineBtn, Button } from '@/components/shared/Forms/Buttons/Buttons';
import {
  FileInput,
  TextArea,
  Input,
  Select,
} from '@/components/shared/Forms/Inputs/Inputs';
import ConfirmDialog from '@/components/shared/confirm';
import { itemData } from '@/constants/demoAPI';
import { fetchSingleSeller, registerNewSeller } from '@/services/api';
import Skeleton from '@/components/skeleton/skeleton';


interface Seller {
  seller_id: string;
  name: string;
  description: string;
  image: string;
  address: string;
  phone: number;
  email: string;
  sale_items: string;
  average_rating: number;
  trust_meter_rating: number;
  type: string;
  coordinates: [];
  order_online_enabled_pref: boolean;
}

const SellerRegistrationForm = () => {
  const HEADER = 'mb-5 font-bold text-lg md:text-2xl';
  const SUBHEADER = 'font-bold mb-2';

  const t = useTranslations();
  const router = useRouter();
  const seller = itemData.seller;

  const [formData, setFormData] = useState({
    itemsForSale: '',
    sellerName: '',
    sellerType: 'Pioneer',
    businessName: '',
    sellerDescription: '',
    sellerAddress: '',
  });
  const [dbSeller, setDbSeller] = useState<Seller>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  useEffect(() => {
    const getSellerData = async () => {
      try {
        const data = await fetchSingleSeller();
        setDbSeller(data); // Ensure this is a single object, not an array
      } catch (error) {
        setError('Error fetching market data');
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
      businessName,
      sellerDescription,
      sellerAddress,
    } = formData;
    setIsFormValid(
      !!(
        itemsForSale &&
        sellerName &&
        businessName &&
        sellerDescription &&
        sellerAddress
      ),
    );
  }, [formData]);

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

  const handleAddImages = () => {};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleNavigation = (route: string) => {
    if (isSaveEnabled) {
      setLinkUrl(route);
      setShowConfirmDialog(true);
    } else {
      router.push(`/${route}`);
    }
  };

  const handleSave = () => {
    // Function to save data to the database
    // Example: saveData({ files, comments, reviewEmoji });
    setIsSaveEnabled(false);
  };

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
        <div className="mb-7">
          <h2 className={SUBHEADER}>
            {t('SCREEN.SELLER_REGISTRATION.REVIEWS_SUMMARY_LABEL')}
          </h2>
          <TrustMeter ratings={seller.trust_meter_rating} />
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm">
              {t('SCREEN.BUY_FROM_SELLER.REVIEWS_SCORE_MESSAGE', {
                seller_review_rating: seller.trust_meter_rating,
              })}
            </p>
            <Link href="/seller/reviews/userid">
              <OutlineBtn
                label={t('SHARED.CHECK_REVIEWS')}
                onClick={() => handleNavigation('seller/reviews')}
              />
            </Link>
          </div>
        </div>
        <div className="mb-7">
          <h2 className={`${SUBHEADER} mb-4`}>
            {t('SCREEN.BUY_FROM_SELLER.SELLER_CONTACT_DETAILS_LABEL')}
          </h2>
          <div className="text-sm mb-3">
            <span className="font-bold">
              {t('SCREEN.BUY_FROM_SELLER.SELLER_PI_ID_LABEL') + ': '}
            </span>
            <span>{seller ? seller.seller_id : ''}</span>
          </div>
          <div className="text-sm mb-3">
            <span className="font-bold">
              {t('SCREEN.BUY_FROM_SELLER.SELLER_PHONE_LABEL') + ': '}
            </span>
            <span>{seller.phone}</span>
          </div>
          <div className="text-sm mb-3">
            <span className="font-bold">
              {t('SCREEN.BUY_FROM_SELLER.SELLER_EMAIL_LABEL') + ': '}
            </span>
            <span>{seller.email}</span>
          </div>
        </div>

        <div className="mb-4">
          <h2 className={SUBHEADER}>
            {t('SCREEN.SELLER_REGISTRATION.SELLER_SETTINGS_LABEL')}
          </h2>
          <Input
            label={t('SCREEN.SELLER_REGISTRATION.SELLER_NAME')}
            name="sellerName"
            placeholder="peejen"
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

          <Input
            label={t('SCREEN.SELLER_REGISTRATION.SELLER_BUSINESS_NAME')}
            name="businessName"
            placeholder="M & M Restaurant"
            type="text"
            value={formData.businessName}
            onChange={handleChange}
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
          {selectedFile && (
            <div className="mt-2">
              <p className="text-sm text-zinc-600">{selectedFile.name}</p>
            </div>
          )}
        </div>

        <div className="mb-7">
          <Button
            label={t('SHARED.SAVE')}
            disabled={!isSaveEnabled}
            styles={{
              color: '#ffc153',
              width: '100%',
              height: '40px',
              padding: '10px',
            }}
            onClick={handleSave}
          />
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
