'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import React, { useEffect, useState } from 'react';

import TrustMeter from '@/components/shared/Review/TrustMeter';
import EmojiPicker from '@/components/shared/Review/emojipicker';
import { OutlineBtn } from '@/components/shared/Forms/Buttons/Buttons';
import { FileInput, TextArea } from '@/components/shared/Forms/Inputs/Inputs';
import ConfirmDialog from '@/components/shared/confirm';
import { PiFestJson } from '@/constants/demoAPI';
import { fetchSingleSeller, createReview } from '@/services/api';
import Link from 'next/link';
import Skeleton from '@/components/skeleton/skeleton';

export default function Page({ params }: { params: { id: string } }) {
  const SUBHEADER = "font-bold mb-2";

  const t = useTranslations();
  const router = useRouter();

  const sellerId = params.id
  console.log('this is seller id', sellerId);
 

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
        const data = await fetchSingleSeller(sellerId); //'testme'
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

  const translateSellerCategory = (category: string): string => {
    switch (category) {
      case 'Pioneer':
        return t('SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_OPTIONS.PIONEER');
      case 'Other':
        return t('SCREEN.SELLER_REGISTRATION.SELLER_TYPE.SELLER_TYPE_OPTIONS.OTHER');
      default:
        return category;
    }
  };

  // loading condition
  if (loading) {
    return (
      <Skeleton type="seller_item" />
    );
  }

  return (
    <>
    <div className="w-full md:w-[500px] md:mx-auto p-4">
      <h1 className="mb-5 font-bold text-lg md:text-2xl">{t('SCREEN.BUY_FROM_SELLER.BUY_FROM_SELLER_HEADER')}</h1>

      {seller && (<div>
        {/* Seller Profile */}
        <div className="flex gap-4 align-center mb-6 relative">
          <div className="rounded-[50%] w-[65px] h-[65px] relative">
            <Image alt="seller logo" src={seller.image} fill={true} className="rounded-[50%]" />
          </div>
          <div className="my-auto">
            <h2 className="font-bold mb-2">{seller.name}</h2>
            <p className="text-sm">{translateSellerCategory('Pioneer')}</p>
          </div>
        </div>

        {/* Seller Description */}
        <div className="mb-5">
          <h2 className={SUBHEADER}>{t('SCREEN.BUY_FROM_SELLER.SELLER_DESCRIPTION_LABEL')}</h2>
          <p className="">{seller.description}</p>
        </div>

        {/* Items List */}
        <h2 className={SUBHEADER}>{t('SCREEN.BUY_FROM_SELLER.SELLER_SALE_ITEMS_LABEL')}</h2>
        <div className="seller_item_container mb-6">
          <p>{seller.sale_items}</p>
        </div>

        {/* Seller Location */}
        <div className="mb-6">
          <h2 className={`SUBHEADER`}>{t('SCREEN.BUY_FROM_SELLER.SELLER_ADDRESS_LOCATION_LABEL')}</h2>
          <p className="mb-3">{seller.address}</p>
          <OutlineBtn label={t('SHARED.NAVIGATE')} onClick={() => handleNavigation('')} />
        </div>

        {/* Leave a Review */}
        <div className="mb-3">
          <h2 className={SUBHEADER}>{t('SCREEN.BUY_FROM_SELLER.LEAVE_A_REVIEW_MESSAGE')}</h2>
          <p>{t('SCREEN.BUY_FROM_SELLER.FACE_SELECTION_REVIEW_MESSAGE')}</p>
          <EmojiPicker onSelect={handleEmojiSelect} />
        </div>

        <div className="mb-2">
          <TextArea placeholder={t('SCREEN.BUY_FROM_SELLER.ADDITIONAL_COMMENTS_PLACEHOLDER')} value={comments} onChange={handleCommentsChange} />
        </div>

        <div className="mb-2">
          <FileInput label={t('SCREEN.BUY_FROM_SELLER.FEEDBACK_PHOTO_UPLOAD_LABEL')} handleAddImages={handleAddImages} images={previewImage} />
        </div>

        {/* Save Button */}
        <div className="mb-7">
          <button
            onClick={handleSave}
            disabled={!isSaveEnabled}
            className={`${isSaveEnabled ? 'opacity-100' : 'opacity-50'} px-6 py-2 bg-primary text-white text-xl rounded-md flex justify-right ms-auto text-[15px]`}>
            {t('SHARED.SAVE')}
          </button>
        </div>

        {/* Summary of Reviews */}
        <div className="mb-7">
          <h2 className={SUBHEADER}>{t('SCREEN.BUY_FROM_SELLER.REVIEWS_SUMMARY_LABEL')}</h2>
          {/* Trust-O-meter */}
          <div>
            <TrustMeter ratings={seller.average_rating.$numberDecimal} />
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm">
              {t('SCREEN.BUY_FROM_SELLER.REVIEWS_SCORE_MESSAGE', {seller_review_rating: seller.average_rating.$numberDecimal})}
            </p>
            <Link href={`/seller/reviews/${sellerId}?buyer=true&seller_name=${seller.name}`}>
            <OutlineBtn label={t('SHARED.CHECK_REVIEWS')} />
            </Link>
          </div>
        </div>
        <div className="mb-7">
          <h2 className={`${SUBHEADER} mb-4`}>{t('SCREEN.BUY_FROM_SELLER.SELLER_CONTACT_DETAILS_LABEL')}</h2>
          <div className="text-sm mb-3">
            <span className="font-bold">{t('SCREEN.BUY_FROM_SELLER.SELLER_PI_ID_LABEL') + ": "}</span>
            <span>{seller.seller_id}</span>
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
        
        <ConfirmDialog
          show={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={setShowConfirmDialog}
          message={t('SHARED.CONFIRM_DIALOG')}
          url={linkUrl}
        />
      </div>
      )}
    </div>  
    </>
  );
}
