'use client';

import { useTranslations } from "next-intl";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../../../context/AppContextProvider";
import { IMembership } from "@/constants/types"
import { MembershipClassType, membershipOptions, membershipBuyOptions, MembershipBuyType } from "@/constants/membershipClassType"
import { fetchMembership } from "@/services/membershipApi"
import { Button } from "@/components/shared/Forms/Buttons/Buttons";
import { Input } from "@/components/shared/Forms/Inputs/Inputs";
import MembershipIcon from '@/components/shared/membership/MembershipIcon';

export default function MembershipPage() {
  const { currentUser, showAlert } = useContext(AppContext);
  const [membershipData, setMembershipData] = useState<IMembership | null>(null);
  const [selectedMembership, setSelectedMembership] = useState<MembershipClassType>(
    membershipOptions[0].value
  );
  const [loading, setLoading] = useState(false);
  const [pickedMembership, setPickedMembership] = useState<MembershipClassType>(MembershipClassType.CASUAL);
  const [pickedMethod, setPickedMethod] = useState<MembershipBuyType>(MembershipBuyType.BUY);
  const [showUpgradeSuccess, setShowUpgradeSuccess] = useState(false);
  const [upgradedTier, setUpgradedTier] = useState<MembershipClassType | null>(null);

  const getMembershipLabel = (tier: MembershipClassType | null) => {
    const match = membershipOptions.find((opt) => opt.value === tier);
    return match?.label || tier;
  };
  const t = useTranslations();
  const HEADER = 'font-bold text-lg md:text-2xl';
  const SUBHEADER = 'font-bold mb-2';

  useEffect(() => {
    const loadMembership = async () => {
      if (!currentUser?.pi_uid) return;
      try {
        const data = await fetchMembership(currentUser.pi_uid);
        setMembershipData(data);
      } catch {
        showAlert("Could not load membership data");
      }
    };
    loadMembership();
  }, [currentUser]);


  return (
    <div className="w-full md:w-[500px] md:mx-auto p-4">
      <h1 className={HEADER}>{'Membership'}</h1>

      <div className="mb-5">
        <h2 className={SUBHEADER}>Current Member Class:</h2>
        <p className="text-gray-600 text-xs mt-1">
          {membershipData?.membership_class || "Casual"}
        </p>
      </div>

      <div className="mb-5">
        <h2 className={SUBHEADER}>Current Membership End Date:</h2>
        <p className="text-gray-600 text-xs mt-1">
          {membershipData?.membership_expiration
            ? new Date(membershipData.membership_expiration).toLocaleString()
            : "No active membership"}
        </p>
      </div>

      <div className="mb-5">
        <h2 className={SUBHEADER}>Mappi allowance remaining:</h2>
        <p className="text-gray-600 text-xs mt-1">{membershipData?.mappi_balance || 0}</p>
      </div>

      <div className="mb-5">
        <h2 className={SUBHEADER}>Pick membership or mappi to buy:</h2>

        <div className="">
          {membershipOptions.map((option, index) => (
            <div
              key={index}
              className="mb-1 flex gap-2 pr-7 items-center cursor-pointer text-nowrap"
              onClick={() => setPickedMembership(option.value)}>
              {                                       
                pickedMembership === option.value ? (
                  // <IoCheckmark />
                  <div className="p-1 bg-green-700 rounded"></div>
                  ) : (
                  // <IoClose />
                  <div className="p-1 bg-yellow-400 rounded"></div>                  
                )
              }
              {option.label} 
              
              <MembershipIcon 
                category='triple_gold' 
                className="ml-1"
                styleComponent={{
                  display: "inline-block",
                  objectFit: "contain",
                  verticalAlign: "middle"
                }}
              />
               - {option.cost}π
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <h2 className={SUBHEADER}>Pick buy Method:</h2>

        <div className="">
          {membershipBuyOptions.map((option, index) => (
            <div
              key={index}
              className="mb-1 flex gap-2 pr-7 items-center cursor-pointer text-nowrap"
              onClick={() => setPickedMethod(option.value)}>
              {                                       
                pickedMethod === option.value ? (
                  <div className="p-1 bg-green-700 rounded"></div>
                  ) : (
                  <div className="p-1 bg-yellow-400 rounded"></div>                  
                )
              }
              {option.label}
            </div>
          ))}
          {pickedMethod === MembershipBuyType.VOUCHER && (
            <div className="mb-4">
              <Input
                label={""}
                placeholder="Enter voucher code"
                type="email"
                name="email"
                // value={formData.email ? formData.email : ''}
                // onChange={handleChange}
              />
            </div>)
          }
        </div>
      </div>

      <div className="mb-5 mt-3 ml-auto w-min">
        <Button
          label={pickedMethod === MembershipBuyType.ADS ? "Watch" : "Buy"}
          // disabled={!isSaveEnabled}
          styles={{
            color: '#ffc153',
            height: '40px',
            padding: '10px 15px',
          }}
          // onClick={handleSave}
        />
      </div>

      
    </div>
  );
}