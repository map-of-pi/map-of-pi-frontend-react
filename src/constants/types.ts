export interface IUser {
  pi_uid: string;
  pi_username: string;
  user_name: string;
}

export interface IUserSettings {
  user_settings_id?: string | null;
  user_name?: string;
  email?: string;
  phone_number?: string;
  image?: string; 
  findme?: string;
  trust_meter_rating: number;
  search_map_center?: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export interface ISeller {
  seller_id: string;
  name: string;
  description: string;
  seller_type: string;
  image: string;
  address: string;
  average_rating: {
    $numberDecimal: string;
  };
  coordinates: [number, number];
  order_online_enabled_pref: boolean;
};

export interface IReviewFeedback {
  _id: string;
  review_receiver_id: string;
  review_giver_id: string;
  reply_to_review_id: string | null;
  rating: number;
  comment: string;
  image: string;
  review_date: string;
}


// Interface representing the selected fields from IUserSettings
export interface PartialUserSettings {
  set_name: string;
  email?: string;
  phone_number?: string;
  findme: string;
  trust_meter_rating: number;
}

// Combined interface representing a seller with selected user settings
export interface ISellerWithSettings extends ISeller, PartialUserSettings {}