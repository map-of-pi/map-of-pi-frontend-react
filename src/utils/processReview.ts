import { ReviewInt, IReviewOutput } from "@/constants/types";
import { resolveDate } from "./date";
import { resolveRating } from "@/app/[locale]/seller/reviews/util/ratingUtils";
import { useTranslations } from "next-intl";

export const processReviews = (data: IReviewOutput[]): ReviewInt[] => {
    const t = useTranslations();
    return data.map((feedback) => {
      const { date, time } = resolveDate(feedback.review_date);
      const { reaction = 'No Reaction', unicode = '😐' } = resolveRating(feedback.rating) || {};
      
      return {
        heading: feedback.comment || t('SHARED.NO_COMMENT'),
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
  