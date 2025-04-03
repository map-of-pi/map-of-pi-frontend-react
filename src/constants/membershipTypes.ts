export enum MembershipType {
    TripleGold = "Triple Gold",
    DoubleGold = "Double Gold",
    Gold = "Gold",
    Green = "Green",
    Member = "Member",
    Casual = "Casual"
  }
  
  export interface MembershipOption {
    value: MembershipType;
    label: string;
    cost: number;
  }
  
  export const membershipOptions: MembershipOption[] = [
    { value: MembershipType.TripleGold, label: "Triple Gold (50 weeks)", cost: 20 },
    { value: MembershipType.DoubleGold, label: "Double Gold (20 weeks)", cost: 10 },
    { value: MembershipType.Gold, label: "Gold (10 weeks)", cost: 5 },
    { value: MembershipType.Green, label: "Green (4 weeks)", cost: 1.5 },
    { value: MembershipType.Member, label: "Member (2 weeks)", cost: 0.5 },
    { value: MembershipType.Casual, label: "Casual", cost: 0 }
  ];
  