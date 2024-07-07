"use client";
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import EmojiPicker from '@/components/shared/Review/emojipicker';
import { FileInput, TextArea } from '@/components/shared/Forms/Inputs/Inputs';
import ConfirmDialog from '@/components/shared/confirm';
import { fetchSingleReview, createReview, updateReview, authenticateUser } from '@/services/api';
import { ReviewFeedbackType, UserType } from '@/constants/types';
import { resolveRating } from '@/components/shared/Review/utils';

interface ReplyToReviewPageProps {
  params: {
    id: string;
  };
  searchParams: {
    seller_name: string;
  };
}

export default function ReplyToReviewPage({
  params,
  searchParams,
}: ReplyToReviewPageProps) {
  const HEADER = 'mb-5 font-bold text-lg md:text-2xl';
  const SUBHEADER = 'font-bold mb-2';

  const t = useTranslations();
  const router = useRouter();

  const reviewId = params.id;
  const sellerName = searchParams.seller_name;

  const [files, setFiles] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<string[]>([]);
  const [comments, setComments] = useState('');
  const [reviewEmoji, setReviewEmoji] = useState<any>(null);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [authUser, setAuthUser] = useState<UserType | null>()

  const [reviewData, setReviewData] = useState<ReviewFeedbackType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await authenticateUser('testme', 'testme');
        setAuthUser(userData)
        console.log('pi user auth:', userData);
      } catch (error:any) {
        console.error('Failed to auto sign-in:', error.message);
      }
    };

    fetchData();
  }, []);



  useEffect(() => {
    const getReviewData = async () => {
      try {
        const data = await fetchSingleReview(reviewId);
        setReviewData(data);
      } catch (error) {
        setError('Error fetching review data');
      } finally {
        setLoading(false);
      }
    };
    getReviewData();
  }, [reviewId]);

  useEffect(() => {
    if (files.length === 0) return;

    const objectUrls = files.map(file => URL.createObjectURL(file));
    setPreviewImage(objectUrls);

    return () => {
      objectUrls.forEach(url => URL.revokeObjectURL(url));
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

  const handleSave = () => {    
    try {
      if (!authUser) {
        return window.alert('user not authenticated');        
      }
      const formData = {
        user: authUser.user.uid,
        seller: 'sellerId',
        comment: comments,
        image: files,
        rating: reviewEmoji
      }
      createReview(authUser, formData);
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

  const translateReactionRating = (reaction: string): string => {
    switch (reaction) {
      case 'Despair':
        return t('SHARED.REACTION_RATING.EMOTIONS.DESPAIR');
      case 'Sad':
        return t('SHARED.REACTION_RATING.EMOTIONS.SAD');
      case 'Okay':
        return t('SHARED.REACTION_RATING.EMOTIONS.OKAY');
      case 'Happy':
        return t('SHARED.REACTION_RATING.EMOTIONS.HAPPY');
      case 'Delight':
        return t('SHARED.REACTION_RATING.EMOTIONS.DELIGHT');
      default:
        return reaction;
    }
  };

  return (
    <>
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      <div className="w-full md:w-[500px] md:mx-auto p-4">
        <h1 className={HEADER}>{t('SCREEN.REPLY_TO_REVIEW.REPLY_TO_REVIEW_HEADER', { seller_id: sellerName })}</h1>

        {reviewData && (
          <div className="mb-4">
            <p className="mb-2">{reviewData.comment}</p>
            <p className="text-sm text-gray-400">{reviewData.reply_to_review_id}</p>
            <p className="text-sm text-gray-600">{t('SCREEN.REPLY_TO_REVIEW.BY_REVIEWER', { buyer_id: reviewData.review_giver_id })}</p>
            <div className="flex items-center mt-2">
              <span className="mr-2">{resolveRating(reviewData.rating)?.unicode}</span>
              <span>{translateReactionRating(resolveRating(reviewData.rating)?.reaction ?? '')}</span>
              <Image alt="review image" src={reviewData.image} width={50} height={50} className="rounded ml-2" />
            </div>
          </div>
        )}

        <div className="mb-3">
          <h2 className={SUBHEADER}>{t('SCREEN.REPLY_TO_REVIEW.REPLY_TO_REVIEW_MESSAGE')}</h2>
          <p>{t('SCREEN.REPLY_TO_REVIEW.FACE_SELECTION_REVIEW_MESSAGE')}</p>
          <EmojiPicker onSelect={handleEmojiSelect} />
        </div>

        <div className="mb-2">
          <TextArea
            placeholder={t('SCREEN.REPLY_TO_REVIEW.ADDITIONAL_COMMENTS_PLACEHOLDER')}
            value={comments}
            onChange={handleCommentsChange}
          />
        </div>

        <div className="mb-2">
          <FileInput
            label={t('SCREEN.REPLY_TO_REVIEW.FEEDBACK_PHOTO_UPLOAD_LABEL')}
            handleAddImages={handleAddImages}
            images={previewImage}
          />
        </div>

        <div className="mb-7">
          <button
            onClick={handleSave}
            disabled={!isSaveEnabled}
            className={`${isSaveEnabled ? 'opacity-100' : 'opacity-50'} px-6 py-2 bg-[#386F4F] text-white text-xl rounded-md flex justify-right ms-auto text-[15px]`}
          >
            {t('SHARED.SAVE')}
          </button>
        </div>

        <ConfirmDialog
          show={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={() => {
            setShowConfirmDialog(false);
            router.push(`/${linkUrl}`);
          }}
          message={t('SHARED.CONFIRM_DIALOG')}
          url={linkUrl}
        />
      </div>
    </>
  );
}
