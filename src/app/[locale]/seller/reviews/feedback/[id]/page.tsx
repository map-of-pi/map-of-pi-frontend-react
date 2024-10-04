"use client";

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../../../../../../context/AppContextProvider';
import ConfirmDialog from '@/components/shared/confirm';
import EmojiPicker from '@/components/shared/Review/emojipicker';
import Skeleton from '@/components/skeleton/skeleton';
import { IReviewFeedback, IReviewOutput } from '@/constants/types';
import { fetchSingleReview } from '@/services/reviewsApi';
import { resolveDate } from '@/utils/date';
import { resolveRating } from '../../util/ratingUtils';
import Link from 'next/link';
import logger from '../../../../../../../logger.config.mjs';

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
interface ReplyToReviewPageProps {
  params: {
    id: string;
  };
  searchParams: {
    user_name: string;
  };
}

interface ReviewInt {
  heading: string;
  date: string;
  time: string;
  giver: string;
  receiver: string;
  reviewId: string;
  receiverId: string;
  giverId: string;
  reaction: string;
  unicode: string;
  image: string;
}

export default function ReplyToReviewPage({ params, searchParams }: ReplyToReviewPageProps) {
  const t = useTranslations();
  const router = useRouter();

  const reviewId = params.id;
  const userName = searchParams.user_name;

  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [reviews, setReviews] = useState<ReviewInt[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState('');

  const { currentUser, autoLoginUser } = useContext(AppContext);

  const processReviews = (data: IReviewOutput[]): ReviewInt[] => {
    return data.map((feedback) => {
      const { date, time } = resolveDate(feedback.review_date);
      const { reaction = 'No Reaction', unicode = '😐' } = resolveRating(feedback.rating) || {};
      
      return {
        heading: feedback.comment || 'No comment provided',
        date,
        time,
        giver: feedback.giver,
        receiver: feedback.receiver,
        receiverId: feedback.review_receiver_id,
        giverId: feedback.review_giver_id,
        reviewId: feedback._id,
        reaction,
        unicode,
        image: feedback.image || '/path/to/default/image.png',  // Use a fallback image if not provided
      };
    });
  };
  
  useEffect(() => {
    if (!currentUser) {
      logger.info('User not logged in; attempting auto-login..');
      autoLoginUser();
    }

    const getReviewData = async () => {
      setLoading(true);
      try {
        logger.info(`Fetching review data for review ID: ${reviewId}`);
        const data = await fetchSingleReview(reviewId);

        if (data.review) {
          const reviewList: IReviewOutput[] = [];
          reviewList.push(data.review); // ensure main review is added first to review list.
          reviewList.push(...data.replies);
          const processedReplies = processReviews(reviewList);
          setReviews(processedReplies);
        } else {
          logger.warn(`No reviews found for review ID: ${reviewId}`);
          setReviews([]);
        }
      } catch (error) {
        logger.error(`Error fetching review for review ID: ${reviewId}`, { error });
        setError('Error fetching review. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getReviewData();
  }, [reviewId, currentUser, reviews.length]);

  // Scroll functions
  const prevSlide = () => {
    if (reviews.length > 1 && currentIndex > 0) {
      setDirection('left'); // Swipe to the left
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const nextSlide = () => {
    if (reviews.length > 1 && currentIndex < reviews.length - 1) {
      setDirection('right'); // Swipe to the right
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };


  if (loading) {
    return <Skeleton type="seller_review" />;
  }

  return (
    <div className="w-full md:w-[500px] md:mx-auto p-4">
      <h1 className="mb-5 font-bold text-lg md:text-2xl">
        {t('Reply to a Review')}
      </h1>
      {error && (<div className="text-red-700 text-center text-lg">Error loading review</div>)}
      {reviews && reviews.length > 0 && (
        <div className="mt-2">
          <h2 className="font-bold mb-2">{t('The review you are replying to')}</h2>

          {/* Scrollable content */}
          <div className="relative overflow-hidden mb-5">
            {/* Review */}
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {reviews.map((review, index) => (
                <div key={index} className="seller_item_container p-2 w-full shrink-0">
                  <div className="flex justify-between items-start mb-3">
                    {/* Left content */}
                    <div className="flex-grow">
                      <p className="text-primary text-sm">
                        {review.giver} {' -> '}
                        <span className="text-primary text-sm">{review.receiver}</span>
                      </p>
                      <p className="text-md break-words">{review.heading}</p>
                    </div>

                    {/* Right content */}
                    <div className="flex flex-col items-end space-y-2">
                      <div className="text-[#828282] text-sm text-right whitespace-nowrap">
                        <p>{review.date}</p>
                        <p>{review.time}</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Image
                          src={review.image}
                          alt="emoji image"
                          width={50}
                          height={50}
                          className="object-cover rounded-md"
                        />
                        <p className="text-xl max-w-[50px]">{review.unicode}</p>
                      </div>
                    </div>
                  </div>

                  {/* Scroll button section */}
                  <div className="flex">
                    <button
                      className={`p-2 rounded-full group hover:bg-gray-100 ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={prevSlide}
                      disabled={currentIndex === 0}
                    >
                      <FaChevronLeft className="text-gray-400 group-hover:text-gray-600 text-2xl" />
                    </button>
                    <button
                      className={`ms-auto p-2 rounded-full group hover:bg-gray-100 ${currentIndex === reviews.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={nextSlide}
                      disabled={currentIndex === reviews.length - 1}
                    >
                      <FaChevronRight className="text-gray-400 group-hover:text-gray-600 text-2xl" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h2 className="font-bold">{t('Give reply review')}</h2>
          <h2 className="text-[#828282]">
            {t('To')}: {currentUser?.user_name === reviews[currentIndex].giver
              ? reviews[currentIndex]?.receiver
              : reviews[currentIndex].giver}
          </h2>
          <EmojiPicker
            sellerId={
              currentUser?.pi_uid === reviews[currentIndex].giverId
                ? reviews[currentIndex]?.receiverId
                : reviews[currentIndex].giverId
            }
            setIsSaveEnabled={setIsSaveEnabled}
            replyToReviewId={reviews[currentIndex]?.reviewId}
            currentUser={currentUser}
          />
        </div>
      )}


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
  );
}
