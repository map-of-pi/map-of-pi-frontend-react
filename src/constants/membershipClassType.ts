export enum MembershipClassType {
  CASUAL = "Casual",
  MEMBER = "Member",
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
  { value: MembershipClassType.TRIPLE_GOLD, label: "Triple Gold (50 weeks)", cost: 20 },
  { value: MembershipClassType.DOUBLE_GOLD, label: "Double Gold (20 weeks)", cost: 10 },
  { value: MembershipClassType.GOLD, label: "Gold (10 weeks)", cost: 5 },
  { value: MembershipClassType.GREEN, label: "Green (4 weeks)", cost: 1.5 },
  { value: MembershipClassType.MEMBER, label: "Member (2 weeks)", cost: 0.5 },
  { value: MembershipClassType.CASUAL, label: "Casual", cost: 0 },
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