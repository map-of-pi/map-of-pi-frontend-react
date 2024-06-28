// Define the Seller type to include the necessary information

export type SellerType = {
    coordinates: [number, number];
    _id: string;
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
    order_online_enabled_pref: boolean;
    __v: number;
  };

export type ReviewType = {
    _id: string;
    review_id: string;
    review_receiver_id: string;
    review_giver_id: string;
    reply_to_review_id: string;
    rating: number | null;
    comment: string;
    image: string;
    review_date: string;
    __v: number | null;
    reaction: string;
    unicode: string
  }