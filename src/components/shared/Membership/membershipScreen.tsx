"use client";

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { membershipOptions, MembershipClassType } from "@/constants/membershipClassType";
import { AppContext } from "../../../../context/AppContextProvider";
import { fetchMembership } from "@/services/membershipApi";
import { IMembership } from "@/constants/types";

const MembershipScreen: React.FC = () => {
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

  useEffect(() => {
    if (window?.Pi && typeof window.Pi.init === "function") {
      window.Pi.init({
        version: "2.0",
        sandbox: true,
        scope: ["payments"],
      });
    }
  }, []);

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

  const handleMembershipUpgrade = async () => {
    if (!currentUser) {
      showAlert("User not logged in.");
      return;
    }

    const selectedOption = membershipOptions.find(opt => opt.value === selectedMembership);
    if (!selectedOption) {
      showAlert("Invalid membership selected.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || ""}/payments/initiate`,
        {
          amount: selectedOption.cost,
          metadata: {
            membership_class: selectedOption.value,
          },
        },
        { withCredentials: true }
      );

      const { paymentId } = res.data;

      if (typeof window.Pi?.createPayment !== "function") {
        showAlert("Pi SDK not loaded");
        return;
      }

      await window.Pi.authenticate(["payments"]);

      window.Pi.createPayment(
        {
          amount: selectedOption.cost.toString(),
          memo: `Upgrade to ${selectedOption.label}`,
          metadata: { paymentId },
        },
        {
          onReadyForServerApproval: async (pid: string) => {
            try {
              await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL || ""}/payments/approve`,
                { paymentId: pid },
                { withCredentials: true }
              );
            } catch {
              showAlert("Error approving payment on server.");
            }
          },
          onReadyForServerCompletion: async (pid: string, txid: string) => {
            try {
              await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL || ""}/payments/complete`,
                { paymentId: pid, txid },
                { withCredentials: true }
              );

              const updated = await fetchMembership(currentUser.pi_uid);
              setMembershipData(updated);
              setUpgradedTier(selectedOption.value);
              setShowUpgradeSuccess(true);
            } catch {
              showAlert("Payment confirmation failed.");
            }
          },
          onCancel: () => {
            showAlert("Payment cancelled by user or insufficient funds.");
          },
          onError: (error: Error) => {
            showAlert("Payment error: " + error.message);
          },
        }
      );
    } catch {
      showAlert("Failed to initiate payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center text-gray-600 mb-6">Membership</h1>

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
          onClick={handleMembershipUpgrade}
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

      {showUpgradeSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full text-center">
            <h2 className="text-xl font-bold text-green-700 mb-2">Membership Upgraded</h2>
            <p className="text-gray-700">
              You’ve successfully upgraded to{" "}
              <span className="font-semibold">{getMembershipLabel(upgradedTier)}</span>.
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