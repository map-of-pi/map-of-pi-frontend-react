'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef, useContext } from 'react';
import { AppContext } from '../../../../../../context/AppContextProvider';
import { resolveRating } from '../util/ratingUtils';
import { OutlineBtn } from '@/components/shared/Forms/Buttons/Buttons';
import EmojiPicker from '@/components/shared/Review/emojipicker';
import ToggleCollapse from '@/components/shared/Seller/ToggleCollapse';
import Skeleton from '@/components/skeleton/skeleton';
import { IReviewOutput } from '@/constants/types';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, TextField } from '@mui/material';
import { fetchReviews } from '@/services/reviewsApi';
import { resolveDate } from '@/utils/date';
import logger from '../../../../../../logger.config.mjs';

interface ReviewInt {
  heading: string;
  date: string;
  time: string;
  giver: string;
  receiver: string;
  reviewId: string;
  reviewerId: string;
  giverId: string;
  reaction: string;
  unicode: string;
  image: string;
}

function SellerReviews({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) {
  const t = useTranslations();
  const userName = searchParams.seller_name;
  const userId = params.id;

  const [giverReviews, setGiverReviews] = useState<ReviewInt[] | null>(null);
  const [receiverReviews, setReciverReviews] = useState<ReviewInt[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const { currentUser } = useContext(AppContext);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getSellerData = async () => {
      try {
        logger.info(`Fetching reviews for seller ID: ${userId}`);

        const data = await fetchReviews(userId);
        if (data && data.length > 0) {
          logger.info(`Fetched ${data.length} reviews for seller ID: ${userId}`);
        } else {
          logger.warn(`No reviews found for seller ID: ${userId}`);
        }

        // Process reviews
        const reviews = data
          .map((feedback: IReviewOutput) => {
            // Check if the feedback is relevant to the current user
            if (feedback.review_giver_id === userId || feedback.review_receiver_id === userId) {
              return {
                heading: feedback.comment,
                date: resolveDate(feedback.review_date).date,
                time: resolveDate(feedback.review_date).time,
                giver: feedback.giver,
                receiver: feedback.receiver,
                reviewerId: feedback.review_giver_id,
                giverId: feedback.review_receiver_id,
                reviewId: feedback._id,
                reaction: resolveRating(feedback.rating)?.reaction,
                unicode: resolveRating(feedback.rating)?.unicode,
              };
            }
            return null; // Return null for irrelevant reviews
          })
          .filter((review: ReviewInt): review is ReviewInt => review !== null); // Remove null values

        // Separate reviews given and received 
        const giverReviews = reviews.filter((review: ReviewInt) => review.giverId === userId);
        const receiverReviews = reviews.filter((review: ReviewInt) => review.reviewerId === userId);

        setGiverReviews(giverReviews);
        setReciverReviews(receiverReviews);
      } catch (error) {
        logger.error(`Error fetching seller reviews for ID: ${ userId }`, { error });
        setError('Error fetching seller data');
      } finally {
        setLoading(false);
      }
    };

    getSellerData();
  }, [userId, currentUser]);

  const handleSearch = () => {
    // Implement search logic here
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

  if (loading) {
    logger.info('Loading seller reviews..');
    return <Skeleton type='seller_review' />;
  }

  return (
    <>
      {error && <div className="error">{error}</div>}
      <div className="px-4 py-[20px] text-[#333333] sm:max-w-[520px] w-full m-auto gap-5">
        <h1 className="text-[#333333] text-lg font-semibold md:font-bold md:text-2xl mb-1">
          {t('SCREEN.CHECK_REVIEWS_FEEDBACK.CHECK_REVIEWS_FEEDBACK_HEADER', {
            seller_id: userName,
          })}
        </h1>

        {/* Search area */}
        <div className='flex gap-3 items-center justify-items-center py-3'>
          <span>{t('SHARED.PIONEER_LABEL')}</span>
          <FormControl className="flex-grow mr-2">
            <TextField
              id="search-input"
              type="text"
              variant="outlined"
              color="success"
              className="bg-none hover:bg-gray-100 w-full rounded-lg"
              label={t('SHARED.SEARCH_REVIEWS')}
              value={""}
              onChange={handleSearch}
              ref={inputRef}
            />
          </FormControl>
          <button
            aria-label="search"
            type="submit"
            className="bg-primary rounded h-full w-15 p-[15.5px] flex items-center justify-center hover:bg-gray-600"
          >
            <SearchIcon className="text-[#ffc153]" />
          </button>
        </div>

        <ToggleCollapse header={t('SCREEN.REVIEWS.GIVE_REVIEW_SECTION_HEADER')}>
          <div>
            <EmojiPicker sellerId={userId} setIsSaveEnabled={setIsSaveEnabled} currentUser={currentUser} />
          </div>
        </ToggleCollapse>

        <ToggleCollapse header={t('SCREEN.REVIEWS.REVIEWS_GIVEN_SECTION_HEADER')}>
          {giverReviews && giverReviews.map((item, index) => (
            <div key={index} className="seller_item_container mb-5">
              <div className='flex'>
                {/* Left content */}
                <div className='mb-3 flex-grow'>
                  <p className="text-primary text-sm">
                    {item.giver} {' -> '}  
                    <span className="text-primary text-sm">{item.receiver}</span>
                  </p>
                  <p className="text-lg">{item.heading}</p>
                </div>

                {/* Right content */}
                <div className='flex flex-col items-end ml-auto'>
                  <div className="text-[#828282] text-right">
                    <p className='text-sm'>{item.date} <br /> {item.time}</p>
                  </div>
                  <div className="flex gap-2 mb-3">
                    <Image
                      src="/images/business/product.png"
                      alt="emoji image"
                      width={60}
                      height={60}
                    />
                    <div className="">
                      <span>{item.unicode}</span>{' '}
                      <span className="text-sm">{translateReactionRating(item.reaction)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Link href={`/seller/reviews/feedback/${item.reviewId}?seller_name=${item.receiver}`}>
                      <OutlineBtn label={t('SHARED.REPLY')} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ToggleCollapse>

        <ToggleCollapse header={t('SCREEN.REVIEWS.REVIEWS_RECEIVED_SECTION_HEADER')}>
          {receiverReviews && receiverReviews.map((item, index) => (
            <div key={index} className="seller_item_container mb-5">
              <div className='flex'>
                {/* Left content */}
                <div className='mb-3 flex-grow'>
                  <p className="text-primary text-sm">
                    {item.giver} {' -> '}
                    <span className="text-primary text-sm">{item.receiver}</span>
                  </p>
                  <p className="text-lg">{item.heading}</p>
                </div>

                {/* Right content */}
                <div className='flex flex-col items-end ml-auto'> 
                  <div className="text-[#828282] text-right mb-2">
                    <p className='text-sm'>{item.date} <br /> {item.time}</p>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Image
                      src="/images/business/product.png"
                      alt="emoji image"
                      width={60}
                      height={60}
                    />
                    <div className="text-right">
                      <span>{item.unicode}</span>{' '}
                      <span className="text-sm">{translateReactionRating(item.reaction)}</span>
                    </div>
                  </div>

                  <div className="flex justify-end items-center w-full">
                    <Link href={`/seller/reviews/feedback/${item.reviewId}?seller_name=${userName}`}>
                      <OutlineBtn label={t('SHARED.REPLY')} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </ToggleCollapse>
      </div>
    </>
  );
}

export default SellerReviews;
