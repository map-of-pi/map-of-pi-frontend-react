export type MyPaymentMetadata = {};

export type AuthResult = {
  accessToken: string;
  user: {
    uid: string;
    username: string;
  };
};

export type IUser = {
  username: string;
  uid: string;
  accessToken: string;
  balance: number;
};

export interface PaymentDTO {
  amount: number;
  user_uid: string;
  created_at: string;
  identifier: string;
  metadata: Object;
  memo: string;
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
    cancelled: boolean;
    user_cancelled: boolean;
  };
  to_address: string;
  transaction: null | {
    txid: string;
    verified: boolean;
    _link: string;
  };
}

export interface WindowWithEnv extends Window {
  __ENV?: {
    backendURL: string;
    sandbox: "true" | "false";
  };
}
