export enum MembershipClassType {
  SINGLE = "Single",
  WHITE = "White",
  GREEN = "Green",
  GOLD = "Gold",
  DOUBLE_GOLD = "Double Gold",
  TRIPLE_GOLD = "Triple Gold",
}

export interface MembershipOption {
  value: MembershipClassType; // same as back-end
  label: string;
  cost: number;
}

export const membershipOptions: MembershipOption[] = [  
  { value: MembershipClassType.SINGLE, label: "Single mappi (2 weeks)", cost: 0.2 },
  { value: MembershipClassType.WHITE, label: "White membership", cost: 1 },
  { value: MembershipClassType.GREEN, label: "Green membership (4 weeks)", cost: 1.5 },
  { value: MembershipClassType.GOLD, label: "Gold membership (10 weeks)", cost: 5 },
  { value: MembershipClassType.DOUBLE_GOLD, label: "Double gold membership (20 weeks)", cost: 10 },
  { value: MembershipClassType.TRIPLE_GOLD, label: "Triple gold membership (50 weeks)", cost: 20 },

];

export enum MembershipBuyType {
  BUY = "buy",
  ADS = "Watch ads (free)",
  VOUCHER = "Use a voucher code (free)",
}

export interface MembershipBuyOption {
  value: MembershipBuyType; // same as back-end
  label: string;
}

export const membershipBuyOptions: MembershipBuyOption[] = [
  { value: MembershipBuyType.BUY, label: "Pay with pi" },
  { value: MembershipBuyType.ADS, label: "Watch ads (free)" },
  { value: MembershipBuyType.VOUCHER, label: "Use a voucher code (free)" },
];