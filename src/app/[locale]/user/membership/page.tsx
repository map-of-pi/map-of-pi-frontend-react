import { useTranslations } from "next-intl";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../../../context/AppContextProvider";

export default function MembershipPage() {
  const { currentUser, showAlert } = useContext(AppContext);
  const [membershipData, setMembershipData] = useState<IMembership | null>(null);
  const [selectedMembership, setSelectedMembership] = useState<MembershipClassType>(
    membershipOptions[0].value
  );
  const [loading, setLoading] = useState(false);
  const [showUpgradeSuccess, setShowUpgradeSuccess] = useState(false);
  const [upgradedTier, setUpgradedTier] = useState<MembershipClassType | null>(null);

  const getMembershipLabel = (tier: MembershipClassType | null) => {
    const match = membershipOptions.find((opt) => opt.value === tier);
    return match?.label || tier;
  };
  const t = useTranslations();
  const SUBHEADER = "font-bold mb-2";

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
      <h1 className="mb-5 text-center font-bold text-lg md:text-2xl">{'Membership'}</h1>

      <div className="mb-5">
        <h2 className="text-base font-bold text-gray-700">Current Member Class:</h2>
        <p className="text-gray-600 text-xs mt-1">
          {membershipData?.membership_class || "Casual"}
        </p>
      </div>

      <div className="mb-5">
        <h2 className="text-base font-bold text-gray-700">Current Membership End Date:</h2>
        <p className="text-gray-600 text-xs mt-1">
          {membershipData?.membership_expiry_date
            ? new Date(membershipData.membership_expiry_date).toLocaleString()
            : "No active membership"}
        </p>
      </div>

      <div className="mb-5">
        <h2 className="text-base font-bold text-gray-700">Upgrade to New Membership:</h2>
        <p className="text-gray-600 text-xs mt-1">
          Select a membership level to upgrade.
        </p>
        <select
          className="border p-2 rounded w-full mt-2"
          value={selectedMembership}
          onChange={(e) => setSelectedMembership(e.target.value as MembershipClassType)}
        >
          {membershipOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} - {option.cost} Pi
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <button
          className="bg-blue-500 text-white text-xs font-semibold py-2 px-4 rounded block ml-auto"
          // onClick={handleMembershipUpgrade}
          disabled={loading}
        >
          {loading ? "Processing..." : "Upgrade"}
        </button>
        <p className="text-center text-gray-500 text-xs mt-2">
          You will be taken to the Pi Wallet to complete your payment.
        </p>
      </div>

      <div className="mb-5">
        <h2 className="text-base font-semibold text-gray-700">Mappi allowance remaining:</h2>
        <p className="text-gray-600 text-xs mt-1">{membershipData?.mappi_balance || 0}</p>
      </div>
    </div>
  );
}