
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <>
    {/* <div className="p-4 max-w-md mx-auto bg-zinc-100 dark:bg-zinc-800 rounded-lg shadow-md h-screen"> */}
    <div className="p-4 max-w-md mx-auto ">
      <h2 className="text-lg font-semibold mb-4">Add/Edit Seller Registration</h2>
      <div className="mb-4">
        <label className={LABEL_CLASS}>Seller items for sale</label>
        <textarea
          name="itemsForSale"
          className={TEXTAREA_CLASS}
          placeholder="Describe your items for sale, price, etc"
          value={formData.itemsForSale}
          onChange={handleChange}
        ></textarea>
      </div>
      <button className={`${BUTTON_CLASS} bg-green-600 text-white mb-4`}>Set Search Centre</button>
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2">Reviews Summary</h3>
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
        <label className={LABEL_CLASS}>Reviews Score </label>
        <Link href="/feedback-for-seller">
         <button className={`${BUTTON_CLASS} border border-green-600 text-green-600`}>
          Check Reviews
         </button>
        </Link>
      </div>
      <div className="mb-4">
        <label className={LABEL_CLASS}>Seller Name</label>
        <input
          type="text"
          name="sellerName"
          className={INPUT_CLASS}
          placeholder="Seller Name"
          value={formData.sellerName}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className={LABEL_CLASS}>Seller Type</label>
        <select
          name="sellerType"
          className={INPUT_CLASS}
          value={formData.sellerType}
          onChange={handleChange}
        >
          <option>Pioneer</option>
          <option>Others</option>
        </select>
      </div>
      <div className="mb-4">
        <label className={LABEL_CLASS}>Seller business name</label>
        <input
          type="text"
          name="businessName"
          className={INPUT_CLASS}
          placeholder="Seller business name"
          value={formData.businessName}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className={LABEL_CLASS}>Seller Description</label>
        <textarea
          name="sellerDescription"
          className={TEXTAREA_CLASS}
          placeholder="Seller Description"
          value={formData.sellerDescription}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="mb-4">
        <label className={LABEL_CLASS}>Seller address or whereabouts</label>
        <textarea
          name="sellerAddress"
          className={TEXTAREA_CLASS}
          placeholder="Describe location where you are selling from"
          value={formData.sellerAddress}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="mb-4">
        <label className={LABEL_CLASS}>Upload Photo (Optional)</label>
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
      <button
        className={`${BUTTON_CLASS} bg-zinc-400 text-white`}
        disabled={!isFormValid}
      >
        Save
      </button>
    </div>
    </>
  );
};

export default SellerRegistrationForm;

