"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../../../../context/AppContextProvider";
import { checkAndAutoLoginUser } from "@/utils/auth";
import { IMembership } from "../../../constants/types";

const MembershipScreen = () => {
  const router = useRouter();
  const { currentUser, autoLoginUser } = useContext(AppContext);
  const [membershipData, setMembershipData] = useState<IMembership | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const membershipOptions = [
    { value: "Casual", label: "Casual" },
    { value: "Member", label: "Member" },
    { value: "Green", label: "Green" },
    { value: "Gold", label: "Gold" },
    { value: "Double Gold", label: "Double Gold" },
    { value: "Triple Gold", label: "Triple Gold" },
  ];

  const [selectedMembership, setSelectedMembership] = useState<string>("");

  useEffect(() => {
    const fetchMembershipData = async () => {
      if (currentUser) {
        try {
          console.log("Authorization Header:", `Bearer ${currentUser?.token || "MISSING"}`);

          const response = await axios.get(
            `http://localhost:8001/api/v1/membership/membership-status/${currentUser.pi_uid}`,
            {
              headers: {
                Authorization: `Bearer ${currentUser.token || ""}`,
              },
            }
          );
          setMembershipData(response.data); // Ensure response.data matches IMembership
        } catch (error) {
          console.error("Error fetching membership data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    // Ensure user is logged in
    checkAndAutoLoginUser(currentUser, autoLoginUser);
    fetchMembershipData();
  }, [currentUser, autoLoginUser, router]);

  if (loading) {
    return <p className="text-center text-gray-600 mt-10">Loading...</p>;
  }

  if (!membershipData) {
    return <p className="text-center text-gray-600 mt-10">No membership data available.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center text-gray-600 mb-6">Membership</h1>

      <div className="mb-5">
        <h2 className="text-base font-bold text-gray-700">Current Member Class:</h2>
        <p className="text-gray-600 text-sm mt-1">
          {membershipData.membership_class || "Casual"}
        </p>
      </div>

      <div className="mb-5">
        <h2 className="text-base font-bold text-gray-700">Subscribe To New Membership:</h2>
        <p className="text-gray-600 text-sm mt-1"> 
          Or buy a single mappi. <br/> 
          Select from drop-down to go to Pi Wallet.</p>
      </div>

      <div className="mb-5">
        <h2 className="text-base font-semibold text-gray-700">Membership Latest End Date:</h2>
        <p className="text-gray-600 text-sm mt-1">
          {membershipData.membership_expiration
            ? new Date(membershipData.membership_expiration).toLocaleString()
            : "No active membership"}
        </p>
      </div>

      <div className="mb-5">
        <h2></h2>
      </div>

      <div className="mb-5">
        <h2 className="text-base font-semibold text-gray-700">Mappi allowance remaning:</h2>
        <p className="text-gray-600 text-sm mt-1">{membershipData.mappi_balance || 0}</p>
      </div>
    </div>
  );
};

export default MembershipScreen;
