'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import { useEffect, useState } from 'react';

import { OutlineBtn } from '@/components/shared/Forms/Buttons/Buttons';
import { ReviewFeedbackType } from '@/constants/types';
import { fetchReviews } from '@/services/reviewsAPI';
import { resolveDate } from '@/util/date';
import { resolveRating } from '../util/ratingUtils';

interface ReviewInt {
  heading: string;
  date: string;
  time: string;
  user: string;
  reviewId: string;
  reaction: string;
  unicode: string;
}
[];

function SellerReviews({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) {
  const t = useTranslations();
  const  sellerName  = searchParams.seller_name;
  const isbuyer = searchParams.buyer;
  const sellerId = params.id;

  const [sellerReviews, setSellerReviews] = useState<ReviewInt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const getSellerData = async () => {
      try {
        const data = await fetchReviews(sellerId);

        const reviewFeedback = data.map((feedback: ReviewFeedbackType) =>{
          return {
            heading: feedback.comment,
            date: resolveDate(feedback.review_date).date,
            time: resolveDate(feedback.review_date).time,
            user: feedback.review_giver_id,
            reviewId: feedback._id,
            reaction: resolveRating(feedback.rating)?.reaction,
            unicode: resolveRating(feedback.rating)?.unicode
          }
        })
        setSellerReviews(reviewFeedback);  // Ensure this is a single object, not an array
      } catch (error) {
        setError('Error fetching seller data');
      } finally {
        setLoading(false);
      }
    };
    getSellerData();
  }, []);


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
    sellerReviews?.length===0 ? 
      <div className="px-4 py-[20px] text-[#333333] sm:max-w-[520px] w-full m-auto">
        <h1 className="text-[#333333] text-lg font-semibold md:font-bold md:text-2xl mb-1">
         No reviews for {sellerName}
        </h1>
      </div> :
    <>
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      <div className="px-4 py-[20px] text-[#333333] sm:max-w-[520px] w-full m-auto">
        <h1 className="text-[#333333] text-lg font-semibold md:font-bold md:text-2xl mb-1">
          {t('SCREEN.CHECK_REVIEWS_FEEDBACK.CHECK_REVIEWS_FEEDBACK_HEADER', {
            seller_id: searchParams.seller_name,
          })}
        </h1>
        {sellerReviews.map((item, index) => (
          <div key={index} className="border-b border-[#D9D9D9] py-4">
            <p className="text-lg mb-2">{item.heading}</p>
            <div className="flex gap-3 text-[#828282]">
              <p>{item.date}</p>
              <p>{item.time}</p>
            </div>
            <div className="text-primary mb-3">
              {t('SCREEN.CHECK_REVIEWS_FEEDBACK.BY_REVIEWER', {
                buyer_id: item.user,
              })}
            </div>
            <div className="flex justify-between items-center">
              <div className="flex">
                <div className="mr-4">
                  <span>{item.unicode}</span>{' '}
                  <span className="text-sm">
                    {translateReactionRating(item.reaction)}
                  </span>
                </div>
                <Image
                  src="/images/business/product.png"
                  alt="emoji image"
                  width={60}
                  height={60}
                />
              </div>
              {isbuyer!=='true' ? null : (
                <Link href={`/seller/reviews/feedback/${item.reviewId}?seller_name=${sellerName}`}>
                  <OutlineBtn label={t('SHARED.REPLY')} />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default SellerReviews;
