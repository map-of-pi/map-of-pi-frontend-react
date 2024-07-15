// Define the Seller type to include the necessary information

export type SellerType = {
  seller_id: string;
  name: string;
  description: string;
  image: string;
  address: string;
  sale_items: string;
  average_rating: {
    $numberDecimal: string;
  };
  trust_meter_rating: number;
  coordinates: [number, number];
  order_online_enabled_pref: boolean;
};

export type CreateSellerType = {
  seller_id: string;
  name: string;
  description: string;
  image: string;
  address: string;
  sale_items: string;
  // coordinates: [number, number];
};

export type ReviewFeedbackType = {
  review_id: string;
  review_receiver_id: string;
  review_giver_id: string;
  reply_to_review_id: string;
  rating: number;
  comment: string;
  image: string;
  review_date: string;
}

export type CreateReviewType = {
  seller: string;
  user: string;
  comment: string;
  rating: number;
  image: File[];
  replyId: string //id of the review you are replying to
}

export interface IUser {
  uid: string;
  username:string
}