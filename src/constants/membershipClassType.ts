export enum MembershipClassType {
  CASUAL = "Casual",
  SINGLE = "Single",
  WHITE = "White",
  GREEN = "Green",
  GOLD = "Gold",
  DOUBLE_GOLD = "Double Gold",
  TRIPLE_GOLD = "Triple Gold",
}


export interface MembershipOption {
  value: MembershipClassType;
  cost: number;
  duration: number | null; // in weeks
  mappi_allowance: number;
}

export const dumyList: MembershipOption[] = [  
  {
    value: MembershipClassType.CASUAL,
    mappi_allowance: 0,
    cost: 0,
    duration: null,
  },
  {
    value: MembershipClassType.SINGLE,
    mappi_allowance: 10,
    cost: 0.2,
    duration: 2,
  },
  {
    value: MembershipClassType.WHITE,
    mappi_allowance: 20,
    cost: 1,
    duration: 3,
  },
  {
    value: MembershipClassType.GREEN,
    mappi_allowance: 50,
    cost: 1.5,
    duration: 4,
  },
   {
    value: MembershipClassType.GOLD,
    mappi_allowance: 100,
    cost: 5,
    duration: 10,
  },
  {
    value: MembershipClassType.DOUBLE_GOLD,
    mappi_allowance: 200,
    cost: 10,
    duration: 20,
  },
  {
    value: MembershipClassType.TRIPLE_GOLD,
    mappi_allowance: 300,
    cost: 20,
    duration: 50,
  }
]


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