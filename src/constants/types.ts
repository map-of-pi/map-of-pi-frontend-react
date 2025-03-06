export interface IUser {
  pi_uid: string;
  pi_username: string;
  user_name: string;
}

export interface IUserSettings {
  user_settings_id?: string | null;
  user_name?: string | null;
  email?: string | null;
  phone_number?: string | null;
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
  sell_map_center: {
    type: 'Point';
    coordinates: [number, number];
  };
  coordinates: [number, number];
  order_online_enabled_pref: boolean;
  fulfillment_method: string;
  fulfillment_description?: string;
}

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

export interface ReviewInt {
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

export enum DeviceLocationType {
  Automatic = 'auto',
  GPS = 'deviceGPS',
  SearchCenter = 'searchCenter'
}

export enum FulfillmentType {
  CollectionByBuyer = 'Collection by buyer',
  DeliveredToBuyer = 'Delivered to buyer'
}

export enum StockLevelType {
  available_1 = '1 available', 
  available_2 = '2 available', 
  available_3 = '3 available',
  many = 'Many available', 
  made_to_order = 'Made to order', 
  ongoing_service = 'Ongoing service', 
  sold = 'Sold'
}

// Select specific fields from IUserSettings
export type PartialUserSettings = Pick<IUserSettings, 'user_name' | 'email' | 'phone_number' | 'findme' | 'trust_meter_rating'>;

// Combined interface representing a seller with selected user settings
export interface ISellerWithSettings extends ISeller, PartialUserSettings {}

export type SellerItem = {
  _id: string;
  seller_id: string;
  name: string;
  description?: string;
  duration: number;
  stock_level: StockLevelType;
  image?: string;
  price: {
    $numberDecimal: number;
  };
  created_at?: Date;
  updated_at?: Date;
  expired_by?: Date;
}

export type PartialReview = {
  giver: string;
  receiver: string;
}

export interface IReviewOutput extends IReviewFeedback, PartialReview {}
