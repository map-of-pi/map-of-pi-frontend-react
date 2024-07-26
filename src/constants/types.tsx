export type SellerType = {
  seller_id: string;
  name: string;
  seller_type: string;
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

export type ReviewFeedbackType = {
  _id: string;
  review_receiver_id: string;
  review_giver_id: string;
  reply_to_review_id: string | null;
  rating: number;
  comment: string;
  image: string;
  review_date: string;
}

export interface IUser {
  pi_uid: string;
  pi_username: string;
  user_name: string;
}
