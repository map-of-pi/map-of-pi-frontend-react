'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import TrustMeter from '@/components/seller/TrustMeter';
import EmojiPicker from '@/components/shared/Review/emojipicker';
import { FileInput, TextArea } from '@/components/shared/Forms/Inputs/Inputs';
import ConfirmDialog from '@/components/shared/confirm';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { itemData } from '@/constants/demoAPI';
import { OutlineBtn } from '@/components/shared/Forms/Buttons/Buttons';

export default function Page() {
  const t = useTranslations();
  const router = useRouter();

  const [files, setFiles] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<string[]>([]);
  const [comments, setComments] = useState('');
  const [reviewEmoji, setReviewEmoji] = useState(null);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  // const [dialogueMessage, setDialogueMessage] = useState('')
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

  // Function to set emoji button value (null or 0 to 4 )
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

  const SUBHEADER = 'font-bold mb-2';

  return (
    <div className="w-full md:w-[500px] md:mx-auto p-4">
      <h1 className="mb-5 font-bold text-lg md:text-2xl">Buy From Seller</h1>

      {/* Seller Profile */}
      <div className="flex gap-4 align-center mb-6 relative">
        <div className="rounded-[50%] w-[65px] h-[65px] relative">
          <Image alt="seller logo" src={itemData.seller.url} fill={true} className='rounded-[50%]' />
        </div>
        <div className="my-auto">
          <h2 className="font-bold mb-2">{itemData.seller.business}</h2>
          <p className="text-sm">{itemData.seller.category}</p>
        </div>
      </div>

      {/* Seller Description */}
      <div className="mb-5">
        <h2 className={SUBHEADER}>Seller Description</h2>
        <p className="">{itemData.seller.description}</p>
      </div>

      {/* Items List */}
      <h2 className={SUBHEADER}>Seller items for sale</h2>
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
        <h2 className={`SUBHEADER`}>Seller address or whereabouts</h2>
        <p className="mb-3">{itemData.seller.address}</p>
        <OutlineBtn
          label="Navigate"
          onClick={() => handleNavigation('location')}
        />
      </div>

      {/* Leave a Review */}
      <div className="mb-3">
        <h2 className={SUBHEADER}>Leave a review</h2>
        <p>Select the face which shows how you feel about the above Seller</p>
        <EmojiPicker onSelect={handleEmojiSelect} />
      </div>

      <div className="mb-2">
        <TextArea
          placeholder={'Enter additional comments here...'}
          value={comments}
          onChange={handleCommentsChange}
        />
      </div>

      <div className="mb-2">
        <FileInput
          label={'Optional feedback photo upload'}
          handleAddImages={handleAddImages}
          images={previewImage}
        />
      </div>

      {/* Save Button */}
      <div className="mb-7">
        <button
          onClick={handleSave}
          disabled={!isSaveEnabled}
          className={`${isSaveEnabled ? 'opacity-100' : 'opacity-50'} px-6 py-2 bg-[#386F4F] text-white text-xl rounded-md flex justify-right ms-auto text-[15px]`}>
          Save
        </button>
      </div>

      {/* Summary of Reviews */}
      <div className="mb-7">
        <h2 className={SUBHEADER}>Reviews summary</h2>
        {/* Trust-O-meter */}
        <div>
          <TrustMeter ratings={itemData.seller.ratings} />
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm">
            Reviews Score: {itemData.seller.ratings} out of 5.0
          </p>
          {/* <button className="outline outline-[#8DBE95] hover:bg-[#386F4F] hover:text-white text-xl text-yellow-500 py-2 px-4 rounded-md flex justify-right ms-auto"
                        onClick={()=>handleNavigation('seller/seller-reviews')}
                    >
                        Check Reviews
                    </button> */}
          <OutlineBtn
            label="Check Reviews"
            onClick={() => handleNavigation('seller/seller-reviews')}
          />
        </div>
      </div>
      <div className="mb-7">
        <h2 className={`${SUBHEADER} mb-4`}>Seller contact details</h2>
        <div className="text-sm mb-3">
          <span className=" font-bold">Seller pioneer id: </span>
          <span>{itemData.seller.pioneer_id}</span>
        </div>
        <div className="text-sm mb-3">
          <span className=" font-bold">Seller phone: </span>
          <span>{itemData.seller.phone}</span>
        </div>
        <div className="text-sm mb-3">
          <span className=" font-bold">Seller email: </span>
          <span>{itemData.seller.email}</span>
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
  );
}
