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

type PiScope =  "payments" | "username" | "roles" | "wallet_address";

// TODO: Add more adequate typing if payments are introduced
export type OnIncompletePaymentFoundType = (payment: PaymentDTO) => void ;

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
};

declare global {
  const Pi: PiType;
}