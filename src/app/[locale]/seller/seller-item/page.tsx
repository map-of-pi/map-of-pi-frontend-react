'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

import TrustMeter from '@/components/seller/TrustMeter';
import EmojiPicker from '@/components/shared/Review/emojipicker';
import { OutlineBtn } from '@/components/shared/Forms/Buttons/Buttons';
import { FileInput, TextArea } from '@/components/shared/Forms/Inputs/Inputs';
import ConfirmDialog from '@/components/shared/confirm';
import { itemData } from '@/constants/demoAPI';

export default function Page() {
  const SUBHEADER = "font-bold mb-2";

  const t = useTranslations();
  const router = useRouter();

  const [files, setFiles] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<string[]>([]);
  const [comments, setComments] = useState('');
  const [reviewEmoji, setReviewEmoji] = useState(null);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  useEffect(() => {
    if (files.length === 0) return;

    const objectUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImage(objectUrls);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  useEffect(() => {
    const noReview =
      comments === '' && reviewEmoji === null && files.length === 0;
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

  // Function to set emoji button value (null or 0 to 4)
  const handleEmojiSelect = (emoji: any) => {
    setReviewEmoji(emoji);
  };

  // Function to collect reviews value and submit to DB
  const handleSave = () => {
    // Function to save data to the database
    // Example: saveData({ files, comments, reviewEmoji });
    setIsSaveEnabled(false);
  };

  // Function to triger notification dialogue
  const handleNavigation = (route: string) => {
    if (isSaveEnabled) {
      // setDialogueMessage(message);
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

  return (
    <div className="w-full md:w-[500px] md:mx-auto p-4">
      <h1 className="mb-5 font-bold text-lg md:text-2xl">{t('SCREEN.BUY_FROM_SELLER.BUY_FROM_SELLER_HEADER')}</h1>

      {/* Seller Profile */}
      <div className="flex gap-4 align-center mb-6 relative">
        <div className="rounded-[50%] w-[65px] h-[65px] relative">
          <Image alt="seller logo" src={itemData.seller.url} fill={true} className='rounded-[50%]' />
        </div>
        <div className="my-auto">
          <h2 className="font-bold mb-2">{itemData.seller.business}</h2>
          <p className="text-sm">{translateSellerCategory(itemData.seller.category)}</p>
        </div>
      </div>

      {/* Seller Description */}
      <div className="mb-5">
        <h2 className={SUBHEADER}>{t('SCREEN.BUY_FROM_SELLER.SELLER_DESCRIPTION_LABEL')}</h2>
        <p className="">{itemData.seller.description}</p>
      </div>

      {/* Items List */}
      <h2 className={SUBHEADER}>{t('SCREEN.BUY_FROM_SELLER.SELLER_SALE_ITEMS_LABEL')}</h2>
      <div className="seller_item_container mb-6">
        <ul>
          {itemData.items.map((item) => (
            <div key={item.id} className="flex gap-2">
              <li>{item.name}</li>
              <li>{item.price}Pi</li>
            </div>
          ))}
        </ul>
      </div>

      {/* Seller Location */}
      <div className="mb-6">
        <h2 className={`SUBHEADER`}>{t('SCREEN.BUY_FROM_SELLER.SELLER_ADDRESS_LOCATION_LABEL')}</h2>
        <p className="mb-3">{itemData.seller.address}</p>
        <OutlineBtn
          label={t('SHARED.NAVIGATE')}
          onClick={() => handleNavigation('location')}
        />
      </div>

      {/* Leave a Review */}
      <div className="mb-3">
        <h2 className={SUBHEADER}>{t('SCREEN.BUY_FROM_SELLER.LEAVE_A_REVIEW_MESSAGE')}</h2>
        <p>{t('SCREEN.BUY_FROM_SELLER.FACE_SELECTION_REVIEW_MESSAGE')}</p>
        <EmojiPicker onSelect={handleEmojiSelect} />
      </div>

      <div className="mb-2">
        <TextArea
          placeholder={t('SCREEN.BUY_FROM_SELLER.ADDITIONAL_COMMENTS_PLACEHOLDER')}
          value={comments}
          onChange={handleCommentsChange}
        />
      </div>

      <div className="mb-2">
        <FileInput
          label={t('SCREEN.BUY_FROM_SELLER.FEEDBACK_PHOTO_UPLOAD_LABEL')}
          handleAddImages={handleAddImages}
          images={previewImage}
        />
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
          <TrustMeter ratings={itemData.seller.ratings} />
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm">
            {t('SCREEN.BUY_FROM_SELLER.REVIEWS_SCORE_MESSAGE', {seller_review_rating: itemData.seller.ratings})}
          </p>
          <OutlineBtn
            label={t('SHARED.CHECK_REVIEWS')}
            onClick={() => handleNavigation('seller/seller-reviews')}
          />
        </div>
      </div>
      <div className="mb-7">
        <h2 className={`${SUBHEADER} mb-4`}>{t('SCREEN.BUY_FROM_SELLER.SELLER_CONTACT_DETAILS_LABEL')}</h2>
        <div className="text-sm mb-3">
          <span className=" font-bold">{t('SCREEN.BUY_FROM_SELLER.SELLER_PI_ID_LABEL') + ": "}</span>
          <span>{itemData.seller.pioneer_id}</span>
        </div>
        <div className="text-sm mb-3">
          <span className=" font-bold">{t('SCREEN.BUY_FROM_SELLER.SELLER_PHONE_LABEL') + ": "}</span>
          <span>{itemData.seller.phone}</span>
        </div>
        <div className="text-sm mb-3">
          <span className=" font-bold">{t('SCREEN.BUY_FROM_SELLER.SELLER_EMAIL_LABEL') + ": "}</span>
          <span>{itemData.seller.email}</span>
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
  );
}
