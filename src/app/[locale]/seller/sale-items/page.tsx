'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import TrustMeter from '@/components/shared/Review/TrustMeter';
import EmojiPicker from '@/components/shared/Review/emojipicker';
import { OutlineBtn } from '@/components/shared/Forms/Buttons/Buttons';
import { FileInput, TextArea } from '@/components/shared/Forms/Inputs/Inputs';
import ConfirmDialog from '@/components/shared/confirm';

import { fetchSingleSeller, createReview } from '@/services/api';
import { itemData, PiFestJson } from '@/constants/demoAPI';

interface Seller {
  id: string;
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

export default function Page() {
  const t = useTranslations();
  const router = useRouter();

  
  const [files, setFiles] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<string[]>([]);
  const [comments, setComments] = useState('');
  const [reviewEmoji, setReviewEmoji] = useState<any>(null);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const [seller, setSeller] = useState(PiFestJson.Seller);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const getSellerData = async () => {
      try {
        const data = await fetchSingleSeller('sellerId');
        setSeller(data);  // Ensure this is a single object, not an array
      } catch (error) {
        setError('Error fetching seller data');
      } finally {
        setLoading(false);
      }
    };
  
    getSellerData();
  }, []);

  useEffect(() => {
    if (files.length === 0) return;

    const objectUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImage(objectUrls);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  useEffect(() => {
    const noReview = comments === '' && reviewEmoji === null && files.length === 0;
    setIsSaveEnabled(!noReview);
  }, [comments, reviewEmoji, files]);

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles(Array.from(selectedFiles));
    }
  };

  const handleCommentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComments(e.target.value);
  };

  const handleEmojiSelect = (emoji: any) => {
    setReviewEmoji(emoji);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('comments', comments);
    formData.append('emoji', reviewEmoji);
    files.forEach(file => formData.append('images', file));

    try {
        await createReview(formData); // Or updateReview if editing an existing review
        setIsSaveEnabled(false);
    } catch (error) {
        console.error('Error saving review:', error);
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

  const SUBHEADER = "font-bold mb-2";

  // loading condition
  if (loading) {
    return (
      <div id="loading-screen">
        <p>Loading seller data...</p>
      </div>
    );
  }

  // if (error) {
  //   setSeller(PiFestJson.Seller)
  //   // return <div>{error}</div>;
  // }

  // const seller = itemData.seller

  return (
    
    <div className="w-full md:w-[500px] md:mx-auto p-4">
      <h1 className="mb-5 font-bold text-lg md:text-2xl">Buy From Seller</h1>

      {seller && (<div>
        {/* Seller Profile */}
        <div className="flex gap-4 align-center mb-6 relative">
          <div className="rounded-[50%] w-[65px] h-[65px] relative">
            <Image alt="seller logo" src={seller.image} fill={true} className="rounded-[50%]" />
          </div>
          <div className="my-auto">
            <h2 className="font-bold mb-2">{seller.name}</h2>
            <p className="text-sm">pioneer</p>
          </div>
        </div>

        {/* Seller Description */}
        <div className="mb-5">
          <h2 className={SUBHEADER}>Seller Description</h2>
          <p className="">{seller.description}</p>
        </div>

        {/* Items List */}
        <h2 className={SUBHEADER}>Seller items for sale</h2>
        <div className="seller_item_container mb-6">
          <p>{seller.sale_items}</p>
        </div>

        {/* Seller Location */}
        <div className="mb-6">
          <h2 className={`SUBHEADER`}>Seller address or whereabouts</h2>
          <p className="mb-3">{seller.address}</p>
          <OutlineBtn label="Navigate" onClick={() => handleNavigation('')} />
        </div>

        {/* Leave a Review */}
        <div className="mb-3">
          <h2 className={SUBHEADER}>Leave a review</h2>
          <p>Select the face which shows how you feel about the above Seller</p>
          <EmojiPicker onSelect={handleEmojiSelect} />
        </div>

        <div className="mb-2">
          <TextArea placeholder="Enter additional comments here..." value={comments} onChange={handleCommentsChange} />
        </div>

        <div className="mb-2">
          <FileInput label="Optional feedback photo upload" handleAddImages={handleAddImages} images={previewImage} />
        </div>

        {/* Save Button */}
        <div className="mb-7">
          <button
            onClick={handleSave}
            disabled={!isSaveEnabled}
            className={`${isSaveEnabled ? 'opacity-100' : 'opacity-50'} px-6 py-2 bg-primary text-white text-xl rounded-md flex justify-right ms-auto text-[15px]`}>
            Save
          </button>
        </div>

        {/* Summary of Reviews */}
        <div className="mb-7">
          <h2 className={SUBHEADER}>Reviews summary</h2>
          {/* Trust-O-meter */}
          <div>
            <TrustMeter ratings={seller.average_rating} />
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm">Reviews Score: {seller.trust_meter_rating} out of 5.0</p>
            <OutlineBtn label="Check Reviews" onClick={() => handleNavigation('seller/reviews')} />
          </div>
        </div>
        <div className="mb-7">
          <h2 className={`${SUBHEADER} mb-4`}>Seller contact details</h2>
          <div className="text-sm mb-3">
            <span className="font-bold">Seller pioneer id: </span>
            <span>{seller.seller_id}</span>
          </div>
          <div className="text-sm mb-3">
            <span className="font-bold">Seller phone: </span>
            <span>{seller.phone}</span>
          </div>
          <div className="text-sm mb-3">
            <span className="font-bold">Seller email: </span>
            <span>{seller.email}</span>
          </div>
        </div>
        
        <ConfirmDialog
          show={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={setShowConfirmDialog}
          message="You have unsaved changes. Do you really want to leave?"
          url={linkUrl}
        />
      </div>
      )}
    </div>
    
  );
}
