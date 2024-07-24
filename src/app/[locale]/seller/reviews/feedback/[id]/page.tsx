"use client";

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { useEffect, useState, useContext } from 'react';

import { AppContext } from '../../../../../../../context/AppContextProvider';
import ConfirmDialog from '@/components/shared/confirm';
import EmojiPicker from '@/components/shared/Review/emojipicker';
import { ReviewFeedbackType } from '@/constants/types';
import { fetchSingleReview } from '@/services/reviewsAPI';
import { resolveDate } from '@/util/date';
import { resolveRating } from '../../util/ratingUtils';

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

  const t = useTranslations();
  const router = useRouter();

  const reviewId = params.id;
  const sellerName = searchParams.seller_name;

  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const [reviewData, setReviewData] = useState<ReviewFeedbackType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { currentUser, autoLoginUser, registerUser } = useContext(AppContext);

  useEffect(() => {
    const getReviewData = async () => {
      try {
        console.log('Review ID: ', reviewId);
        const data = await fetchSingleReview(reviewId);
        setReviewData(data);
      } catch (error) {
        setError('Error fetching review data');
      } finally {
        setLoading(false);
      }
    };
    getReviewData();

    // try re-login user if not current user auth
    const token = localStorage.getItem('mapOfPiToken');
    if (!currentUser) {
      console.log("Not logged in; pending login..");
      registerUser();
    } else {
        autoLoginUser();
      console.log("Logged in");
    }
  }, [reviewId, currentUser]);

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
            <p className="text-sm text-gray-600">{resolveDate(reviewData.review_date).date}  {resolveDate(reviewData.review_date).time}</p>
            <p className="text-sm text-[#3D924A8A]">{t('SCREEN.REPLY_TO_REVIEW.BY_REVIEWER', { buyer_id: reviewData.review_giver_id })}</p>
            <div className="flex items-center mt-2">
              <span className="mr-2">{resolveRating(reviewData.rating)?.unicode}</span>
              <span>{translateReactionRating(resolveRating(reviewData.rating)?.reaction ?? '')}</span>
              <Image alt="review image" src={reviewData.image} width={50} height={50} className="rounded ml-2" />
            </div>
          </div>
        )}

        <div>
          <EmojiPicker
          sellerId={reviewData?.review_receiver_id} 
          setIsSaveEnabled={setIsSaveEnabled} 
          replyToReviewId={reviewId} 
          currentUser={currentUser}
          />
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
