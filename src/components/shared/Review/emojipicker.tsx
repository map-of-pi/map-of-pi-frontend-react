"use client";

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

import { TextArea } from '../Forms/Inputs/Inputs';
import { FileInput } from '../Forms/Inputs/Inputs';
import { createReview } from '@/services/reviewsApi';

interface Emoji {
  name: string;
  unicode: string;
  code: string;
  value: number;
}

export default function EmojiPicker(props: any) {
  const t = useTranslations();

  const despairEmoji: Emoji = { name: t('SHARED.REACTION_RATING.EMOTIONS.DESPAIR'), unicode: "😠", code: ":despair:", value: 0 };
  const emojis: Emoji[] = [
    { name: t('SHARED.REACTION_RATING.EMOTIONS.SAD'), unicode: "🙁", code: ":sad_face:", value: 2 },
    { name: t('SHARED.REACTION_RATING.EMOTIONS.OKAY'), unicode: "🙂", code: ":okay_face:", value: 3 },
    { name: t('SHARED.REACTION_RATING.EMOTIONS.HAPPY'), unicode: "😃", code: ":happy_face:", value: 4 },
    { name: t('SHARED.REACTION_RATING.EMOTIONS.DELIGHT'), unicode: "😍", code: ":delight_face:", value: 5 }
  ];

  const [selectedEmoji, setSelectedEmoji] = useState<number | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<string[]>([]);
  const [comments, setComments] = useState('');
  const [reviewEmoji, setReviewEmoji] = useState<number | null>(null);
  const [isSaveActive, setIsSaveActive] = useState<boolean>(false);

  // function preview image upload
  useEffect(() => {
    if (files.length === 0) return;
    const objectUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImage(objectUrls);
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  // function to toggle save button
  useEffect(() => {
    const noReview = comments === '' && reviewEmoji === null && files.length === 0;
    setIsSaveActive(!noReview);
    props.setIsSaveEnabled(!noReview)
  }, [comments, reviewEmoji, files]);


  const handleCommentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComments(e.target.value);
  };

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles(Array.from(selectedFiles));
    }
  };

  const resetReview = () => {
    setSelectedEmoji(null)
    setReviewEmoji(null)
    setComments('');
    setPreviewImage([]);
    setFiles([]);
    setIsSaveActive(false);
    props.setIsSaveEnabled(false)
  }

  const handleSave = async () => {
    try {
      if (props.currentUser) {
        if (reviewEmoji === null) {
          return window.alert(t('SHARED.REACTION_RATING.VALIDATION.SELECT_EMOJI_EXPRESSION'));
        } else {
          const formData = new FormData();
          formData.append('comment', comments);
          formData.append('rating', reviewEmoji.toString());
          formData.append('review_receiver_id', props.sellerId);
          files.forEach((file) => formData.append('image', file));
          formData.append('reply_to_review_id', props.replyToReviewId || '');

          console.log('Form Data:', formData);

          const res = await createReview(formData);
          console.log('response from review submission', res)

          window.alert(t('SHARED.REACTION_RATING.VALIDATION.SUCCESSFUL_REVIEW_SUBMISSION'));
          resetReview();
        }
      } else {
        console.log('Unable to submit review; user not authenticated.');
        window.alert(t('SHARED.REACTION_RATING.VALIDATION.UNSUCCESSFUL_REVIEW_SUBMISSION'));
      }
    } catch (error) {
      console.error('Error saving review:', error);
      window.alert(t('SHARED.REACTION_RATING.VALIDATION.UNSUCCESSFUL_REVIEW_SUBMISSION'));
    }
  };
  
  // Function to handle the click of an emoji
  const handleEmojiClick = (emojiValue: number) => {
    if (selectedEmoji === emojiValue) {
      setSelectedEmoji(null);
      setReviewEmoji(null); // return null when no emoji is sellected
    } else {
      setSelectedEmoji(emojiValue);
      setReviewEmoji(emojiValue);  // return selected emoji value
    }
  };

  const getReview = (reviews: { [key: string]: number } | undefined, emojiName: string): number | undefined => {
    if (reviews) {
      return reviews[emojiName];
    }
    return undefined;
  };
  const emojiBtnClass = 'rounded-md w-full outline outline-[0.5px] flex justify-center items-center cursor-pointer p-1'
  const SUBHEADER = "font-bold mb-2";
  return (
    <div className="mb-3">
        <h2 className={SUBHEADER}>{t('SCREEN.BUY_FROM_SELLER.LEAVE_A_REVIEW_MESSAGE')}</h2>
        <p>{t('SCREEN.BUY_FROM_SELLER.FACE_SELECTION_REVIEW_MESSAGE')}</p>
      <div className='flex sm:overflow-hidden overflow-auto gap-3 w-full text-center justify-center my-2'>
        <div className='bg-[#DF2C2C33] flex-grow-[0.5] rounded-md p-2'>
          <p className='text-red-700 mb-2'>{t('SHARED.REACTION_RATING.UNSAFE')}</p>
          <div
            onClick={() => !props.clickDisabled ? handleEmojiClick(despairEmoji.value) : undefined}
            className={`${selectedEmoji !== despairEmoji.value ? 'bg-red-200' : 'bg-red-700'} outline-[#DF2C2C] ${emojiBtnClass}`}
          >
            <div>
              <p className='text-3xl md:py-2 py-1'>{despairEmoji.unicode}</p>
              <p className={`md:text-[16px] text-[14px] ${selectedEmoji == despairEmoji.value && 'text-white'}`}>{despairEmoji.name}</p>
              {props.reviews && (
                <p>{getReview(props.reviews, despairEmoji.name)}</p>
              )}
            </div>
          </div>
        </div>
        <div className='bg-[#3D924A8A] rounded-[10px] flex-grow-[4.3] flex-4 p-2 text-center text-white'>
          <p className='mb-2'>{t('SHARED.REACTION_RATING.TRUSTWORTHY')}</p>
          <div id='emoji-picker' className='flex gap-3 justify-center'>
            {emojis.map((emoji, index) => (
              <li
                key={index}
                onClick={() => !props.clickDisabled ? handleEmojiClick(emoji.value) : undefined}
                className={`${selectedEmoji !== emoji.value ? 'bg-transparent' : 'bg-primary'} outline-[#090C49] ${emojiBtnClass}`}
              >
                <div>
                  <p className='text-3xl md:py-2 py-1'>{emoji.unicode}</p>
                  <p className='md:text-[16px] text-[14px]'>{emoji.name}</p>
                  {props.reviews && (
                    <p>{getReview(props.reviews, emoji.name)}</p>
                  )}                                 
                </div>
              </li>
            ))}
          </div>
        </div>
      </div>
      <div className="mb-2">
        <TextArea placeholder={t('SCREEN.BUY_FROM_SELLER.ADDITIONAL_COMMENTS_PLACEHOLDER')} 
        value={comments} 
        onChange={handleCommentsChange} 
        maxLength={100}
        />
      </div>
      <div className="mb-2">
          <FileInput label={t('SCREEN.BUY_FROM_SELLER.FEEDBACK_PHOTO_UPLOAD_LABEL')} handleAddImages={handleAddImages} images={previewImage} />
        </div>

        {/* Save Button */}
        <div className="mb-7">
          <button
            onClick={handleSave}
            disabled={!isSaveActive}
            className={`${isSaveActive ? 'opacity-100' : 'opacity-50'} px-6 py-2 bg-primary text-white text-xl rounded-md flex justify-right ms-auto text-[15px]`}>
            {t('SHARED.SAVE')}
          </button>
        </div>
    </div>
  );  
}
