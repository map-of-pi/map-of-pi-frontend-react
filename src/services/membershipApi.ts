import axiosClient from "@/config/client";
import { IMembership } from "@/constants/types";

// Fetch current user’s membership
export const fetchMembership = async (pi_uid: string): Promise<IMembership> => {
  const response = await axiosClient.get(`/memberships/pi/${pi_uid}`, {
    withCredentials: true,
  });
  return response.data;
};

// Upgrade or create membership
// Legacy endpoint — do not use in production.
// Membership upgrades should go through Pi payment (U2A) flow instead.
export const manageMembership = async (data: {
  membership_class: string;
  membership_duration: number;
  mappi_allowance: number;
}) => {
  const response = await axiosClient.put("/memberships/manage", data, {
    withCredentials: true,
  });
    return response.data;
};