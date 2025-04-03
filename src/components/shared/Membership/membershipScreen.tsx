"use client";

import React, { useEffect, useState, useContext } from "react";
import { fetchMembership, manageMembership } from "@/services/membershipApi";
import { membershipOptions, MembershipType } from "@/constants/membershipTypes";
import { AppContext } from "../../../../context/AppContextProvider";

const MembershipScreen = () => {
  const { currentUser, showAlert } = useContext(AppContext);
  const [membershipData, setMembershipData] = useState<any>(null);
  const [selectedMembership, setSelectedMembership] = useState<MembershipType>(membershipOptions[0].value);
  const [loading, setLoading] = useState(false);
  const [showUpgradeSuccess, setShowUpgradeSuccess] = useState(false);
  const [upgradedTier, setUpgradedTier] = useState<MembershipType | null>(null);

  const getMembershipLabel = (value: MembershipType | null) => {
    const match = membershipOptions.find((opt) => opt.value === value);
    return match?.label || value;
  };  

  useEffect(() => {
    const loadMembership = async () => {
      if (!currentUser) return;
      try {
        const data = await fetchMembership(currentUser.pi_uid);
        setMembershipData(data);
      } catch (err) {
        showAlert("Could not load membership data");
      }
    };
    loadMembership();
  }, [currentUser]);

  const handleMembershipUpgrade = async () => {
    try {
      setLoading(true);
      await manageMembership({
        membership_class: selectedMembership,
        membership_duration: 2,
        mappi_allowance: 100,
      });
      setUpgradedTier(selectedMembership);
      setShowUpgradeSuccess(true);
    } catch (err) {
      showAlert("Failed to upgrade membership.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center text-gray-600 mb-6">Membership</h1>

      <div className="mb-5">
        <h2 className="text-base font-bold text-gray-700">Current Member Class:</h2>
        <p className="text-gray-600 text-xs mt-1">{membershipData?.membership_class || "Casual"}</p>
      </div>

      <div className="mb-5">
        <h2 className="text-base font-bold text-gray-700">Current Member Latest End Date:</h2>
        <p className="text-gray-600 text-xs mt-1">
          {membershipData?.membership_expiry_date
            ? new Date(membershipData.membership_expiry_date).toLocaleString()
            : "No active membership"}
        </p>
      </div>

      <div className="mb-5">
        <h2 className="text-base font-bold text-gray-700">Upgrade To New Membership:</h2>
        <p className="text-gray-600 text-xs mt-1">
          Buy a single mappi.<br />
          Or select a member level to buy.
        </p>

        <select
          className="border p-2 rounded w-full mt-2"
          value={selectedMembership}
          onChange={(e) => setSelectedMembership(e.target.value as MembershipType)}
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
          className="bg-primary text-secondary text-xs font-semibold py-2 px-4 rounded block ml-auto"
          onClick={handleMembershipUpgrade}
          disabled={loading}
        >
          Save
        </button>
        <p className="text-center text-gray-500 text-xs mt-2">
          Save will take you to the Pi Wallet screens.
        </p>
      </div>

      <div className="mb-5">
        <h2 className="text-base font-semibold text-gray-700">Mappi allowance remaining:</h2>
        <p className="text-gray-600 text-xs mt-1">{membershipData?.mappi_balance || 0}</p>
      </div>
      {showUpgradeSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full text-center">
            <h2 className="text-xl font-bold text-green-700 mb-2">🎉 Membership Upgraded!</h2>
            <p className="text-gray-700">
              You’ve successfully upgraded to <span className="font-semibold">{getMembershipLabel(upgradedTier)}</span>.
            </p>
            <button
              onClick={() => setShowUpgradeSuccess(false)}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipScreen;
