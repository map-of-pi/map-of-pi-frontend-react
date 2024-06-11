"use client";

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useState, useEffect } from 'react';

import TrustMeter from '@/components/seller/TrustMeter';
import { OutlineBtn, Button } from '@/components/shared/Forms/Buttons/Buttons';
import { FileInput, TextArea, Input, Select } from '@/components/shared/Forms/Inputs/Inputs';
import ConfirmDialog from '@/components/shared/confirm';
import { itemData } from '@/constants/demoAPI';
import { fetchSingleSeller } from '@/services/api';

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
  const router = useRouter();
  const seller = itemData.seller;

  const [formData, setFormData] = useState({
    itemsForSale: '',
    sellerName: '',
    sellerType: 'Pioneer',
    businessName: '',
    sellerDescription: '',
    sellerAddress: ''
  });
  
  const t = useTranslations();

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
        setDbSeller(data);  // Ensure this is a single object, not an array
      } catch (error) {
        setError('Error fetching market data');
      } finally {
        setLoading(false);
      }
    };
  
    getSellerData();
  }, []);

  // if (loading) {
  //   return (
  //     <div id="loading-screen">
  //       <p>Loading seller data...</p>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return <div>{error}</div>;
  // }


  useEffect(() => {
    const { itemsForSale, sellerName, businessName, sellerDescription, sellerAddress } = formData;
    setIsFormValid(!!(itemsForSale && sellerName && businessName && sellerDescription && sellerAddress));
  }, [formData]);

  // useEffect(() => {
  //   const { itemsForSale, sellerName, businessName, sellerDescription, sellerAddress } = formData;
  //   const noInput = itemsForSale === '' && sellerName === '' && businessName === '' && sellerDescription === '' && sellerAddress === '';
  //   setIsSaveEnabled(!noInput);
  // }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (value!=='' && formData){
      setIsSaveEnabled(true)
    }else{
      setIsSaveEnabled(false)
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

  const HEADER = "mb-5 font-bold text-lg md:text-2xl";
  const SUBHEADER = "font-bold mb-2";

  return (
    <>
      <div className="w-full md:w-[500px] md:mx-auto p-4">
        <h1 className={HEADER}>{t('SCREEN.SELLER_REGISTRATION.SELLER_REGISTRATION_HEADER')}</h1>
        
        <div className="mb-4">
          <h2 className={SUBHEADER}>{t('SCREEN.SELLER_REGISTRATION.SELLER_SALE_ITEMS_LABEL')}</h2>
          <div className="mb-2">
            <TextArea 
              name="itemsForSale"
              placeholder={t('SCREEN.SELLER_REGISTRATION.SELLER_SALE_ITEMS_PLACEHOLDER')} 
              value={formData.itemsForSale} 
              onChange={handleChange} 
            />
          </div>
        </div>
        <Button 
          label={t('SHARED.SEARCH_CENTER')}
          styles={{
            color: '#ffc153',
            height: '40px',
            padding: '10px',
            marginLeft: 'auto',
          }}
        />

        <div className="mb-7">
          <h2 className={SUBHEADER}>{t('SCREEN.SELLER_REGISTRATION.REVIEWS_SUMMARY_LABEL')}</h2>
          <TrustMeter ratings={seller.trust_meter_rating} />
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm">{t('SCREEN.BUY_FROM_SELLER.REVIEWS_SCORE_MESSAGE', {seller_review_rating: seller.trust_meter_rating})}</p>
            <OutlineBtn label={t('SHARED.CHECK_REVIEWS')} onClick={() => handleNavigation('seller/seller-reviews')} />
          </div>
        </div>
        <div className="mb-7">
          <h2 className={`${SUBHEADER} mb-4`}>{t('SCREEN.BUY_FROM_SELLER.SELLER_CONTACT_DETAILS_LABEL')}</h2>
          <div className="text-sm mb-3">
            <span className="font-bold">{t('SCREEN.BUY_FROM_SELLER.SELLER_PI_ID_LABEL') + ": "}</span>
            <span>{seller ? seller.seller_id : ""}</span>
          </div>
          <div className="text-sm mb-3">
            <span className="font-bold">{t('SCREEN.BUY_FROM_SELLER.SELLER_PHONE_LABEL') + ": "}</span>
            <span>{seller.phone}</span>
          </div>
          <div className="text-sm mb-3">
            <span className="font-bold">{t('SCREEN.BUY_FROM_SELLER.SELLER_EMAIL_LABEL') + ": "}</span>
            <span>{seller.email}</span>
          </div>
        </div>

        <div className="mb-4">
          <h2 className={SUBHEADER}>Seller settings</h2>
          <Input 
            label="Seller name" 
            name="sellerName"
            placeholder="Peejen"
            type="text"
            value={formData.sellerName}
            onChange={handleChange}
          />

          <Select
            label="Search Center"
            name="sellerType"
            value={formData.sellerType}
            onChange={handleChange}
            options={[
              { value: 'Ilinois cener, 4 bk', name: 'Ilinois cener, 4 bk' },
            ]}
          />

          <Input 
            label="Seller business name" 
            name="businessName"
            placeholder="M & M Restaurant"
            type="text"
            value={formData.businessName}
            onChange={handleChange}
          />

          <TextArea 
            label="Seller description" 
            name="sellerDescription"
            placeholder="I sell items for pay with pi"
            value={formData.sellerDescription}
            onChange={handleChange}
          />

          <TextArea 
            label="Seller address or whereabouts" 
            name="sellerAddress"
            placeholder="Describe location where you are selling from"
            value={formData.sellerAddress}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label>Photo</label>
          <label className="border-dashed border-2 border-zinc-400 p-4 rounded-lg flex flex-col items-center cursor-pointer">
            <Image src="/images/shared/upload.png" alt="Upload" width={100} height={100} className="mb-2" />
            <p className="text-sm text-zinc-600">Drop your image here, or browse</p>
            <p className="text-xs text-zinc-400">Supports: PNG, JPG, JPEG, WEBP</p>
            <p className="text-xs text-red-600">One Photo Only</p>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange} 
            />
          </label>
          {selectedFile && (
            <div className="mt-2">
              <p className="text-sm text-zinc-600">Selected file: {selectedFile.name}</p>
            </div>
          )}
        </div>

        <div className="mb-7">
          <Button
            label="Save"
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
          message="You have unsaved changes. Do you really want to leave?"
          url={linkUrl}
        />
      </div>
    </>
  );
};

export default SellerRegistrationForm;
