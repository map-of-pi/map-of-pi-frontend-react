"use client";

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { useState, useEffect } from 'react';

import { FileInput } from '@/components/shared/Forms/Inputs/Inputs';

const INPUT_CLASS = 'w-full p-2 border rounded-lg';
const BUTTON_CLASS = 'w-full p-2 rounded-lg';
const LABEL_CLASS = 'block text-sm mb-2';
const TEXTAREA_CLASS = 'w-full p-2 border rounded-lg';

const SellerRegistrationForm = () => {
  const [formData, setFormData] = useState({
    itemsForSale: '',
    sellerName: '',
    sellerType: 'Pioneer',
    businessName: '',
    sellerDescription: '',
    sellerAddress: ''
  });
  
  const t = useTranslations();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { itemsForSale, sellerName, businessName, sellerDescription, sellerAddress } = formData;
    setIsFormValid(!!(itemsForSale && sellerName && businessName && sellerDescription && sellerAddress));
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddImages = () => {};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <>
    <div className="p-4 max-w-md mx-auto ">
      <h2 className="text-lg font-semibold mb-4">{t('SCREEN.SELLER_REGISTRATION.SELLER_REGISTRATION_HEADER')}</h2>
      <div className="mb-4">
        <label className={LABEL_CLASS}>{t('SCREEN.SELLER_REGISTRATION.SELLER_SALE_ITEMS_LABEL')}</label>
        <textarea
          name="itemsForSale"
          className={TEXTAREA_CLASS}
          placeholder={t('SCREEN.SELLER_REGISTRATION.SELLER_SALE_ITEMS_PLACEHOLDER')}
          value={formData.itemsForSale}
          onChange={handleChange}
        ></textarea>
      </div>
      <button className={`${BUTTON_CLASS} bg-green-600 text-white mb-4`}>{t('SHARED.SEARCH_CENTER')}</button>
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2">{t('SCREEN.SELLER_REGISTRATION.REVIEWS_SUMMARY_LABEL')}</h3>
        <label className={LABEL_CLASS}>Trust-o-meter</label>
        <input type="range" className="w-full mb-2" min="0" max="100" value="50" />
        <div className="flex justify-between text-xs">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>
      <div className="mb-4">
        <label className={LABEL_CLASS}>{t('SCREEN.SELLER_REGISTRATION.REVIEWS_SCORE_LABEL')}</label>
        <Link href="/seller/seller-reviews">
         <button className={`${BUTTON_CLASS} border border-green-600 text-green-600`}>
          {t('SHARED.CHECK_REVIEWS')}
         </button>
        </Link>
      </div>
      <div className="mb-4">
        <label className={LABEL_CLASS}>{t('SCREEN.SELLER_REGISTRATION.SELLER_NAME')}</label>
        <input
          type="text"
          name="sellerName"
          className={INPUT_CLASS}
          placeholder={t('SCREEN.SELLER_REGISTRATION.SELLER_NAME')}
          value={formData.sellerName}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className={LABEL_CLASS}>{t('SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_LABEL')}</label>
        <select
          name="sellerType"
          className={INPUT_CLASS}
          value={formData.sellerType}
          onChange={handleChange}
        >
          <option>{t('SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_OPTIONS.PIONEER')}</option>
          <option>{t('SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_OPTIONS.OTHER')}</option>
        </select>
      </div>
      <div className="mb-4">
        <label className={LABEL_CLASS}>{t('SCREEN.SELLER_REGISTRATION.SELLER_BUSINESS_NAME')}</label>
        <input
          type="text"
          name="businessName"
          className={INPUT_CLASS}
          placeholder={t('SCREEN.SELLER_REGISTRATION.SELLER_BUSINESS_NAME')}
          value={formData.businessName}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className={LABEL_CLASS}>{t('SCREEN.SELLER_REGISTRATION.SELLER_DESCRIPTION')}</label>
        <textarea
          name="sellerDescription"
          className={TEXTAREA_CLASS}
          placeholder={t('SCREEN.SELLER_REGISTRATION.SELLER_DESCRIPTION')}
          value={formData.sellerDescription}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="mb-4">
        <label className={LABEL_CLASS}>{t('SCREEN.SELLER_REGISTRATION.SELLER_ADDRESS_LOCATION_LABEL')}</label>
        <textarea
          name="sellerAddress"
          className={TEXTAREA_CLASS}
          placeholder={t('SCREEN.SELLER_REGISTRATION.SELLER_ADDRESS_LOCATION_PLACEHOLDER')}
          value={formData.sellerAddress}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="mb-4">
        <FileInput
          label={t('SHARED.PHOTO.UPLOAD_PHOTO_LABEL')}
          images={[]}
          handleAddImages={handleAddImages}
        />
      </div>
      <button
        className={`${BUTTON_CLASS} bg-zinc-400 text-white`}
        disabled={!isFormValid}
      >
        {t('SHARED.SAVE')}
      </button>
    </div>
    </>
  );
};

export default SellerRegistrationForm;

