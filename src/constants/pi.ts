// Pi SDK type definitions
// Based on SDK reference at https://github.com/pi-apps/pi-platform-docs/blob/master/SDK_reference.md

interface PaymentDTO {
  amount: number,
  user_uid: string,
  created_at: string,
  identifier: string,
  metadata: Object,
  memo: string,
  status: {
    developer_approved: boolean,
    transaction_verified: boolean,
    developer_completed: boolean,
    cancelled: boolean,
    user_cancelled: boolean,
  },
  to_address: string,
  transaction: null | {
    txid: string,
    verified: boolean,
    _link: string,
  },
};

type PiScope = "payments" | "username" | "roles" | "wallet_address";

// TODO: Add more adequate typing if payments are introduced
export type OnIncompletePaymentFoundType = (payment: PaymentDTO) => void;

export interface AuthResult {
  accessToken: string;
  user: {
    uid: string;
    username: string;
  };
};

type AuthenticateType = (
  scopes: PiScope[],
  onIncompletePaymentFound: OnIncompletePaymentFoundType
) => Promise<AuthResult>;

interface InitParams {
  version: string,
  sandbox?: boolean
}

interface PiType {
  authenticate: AuthenticateType;
  init: (config: InitParams) => void;
  initialized: boolean;
  nativeFeaturesList(): Promise<("inline_media" | "request_permission" | "ad_network")[]>;
  Ads: {
    showAd: (adType: AdType) => Promise<ShowAdResponse>
    isAdReady: (adType: AdType) => Promise<IsAdReadyResponse>
    requestAd: (adType: AdType) => Promise<RequestAdResponse>
  }
};

type AdType = "interstitial" | "rewarded";

type ShowAdResponse =
  | {
    type: "interstitial";
    result: "AD_CLOSED" | "AD_DISPLAY_ERROR" | "AD_NETWORK_ERROR" | "AD_NOT_AVAILABLE";
  }
  | {
    type: "rewarded";
    result: "AD_REWARDED" | "AD_CLOSED" | "AD_DISPLAY_ERROR" | "AD_NETWORK_ERROR" | "AD_NOT_AVAILABLE" | "ADS_NOT_SUPPORTED" | "USER_UNAUTHENTICATED";
    adId?: string;
  };

type IsAdReadyResponse = {
  type: AdType;
  ready: boolean;
};

type RequestAdResponse = {
  type: AdType;
  result: "AD_LOADED" | "AD_FAILED_TO_LOAD" | "AD_NOT_AVAILABLE";
};

declare global {
  const Pi: PiType;
}