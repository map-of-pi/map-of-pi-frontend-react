import axiosClient from "@/config/client";
import { IMembership } from "@/constants/types";

// Fetch current user’s membership
export const fetchMembership = async (membership_id: string): Promise<IMembership> => {
  const response = await axiosClient.get(`/memberships/${membership_id}`, {
    withCredentials: true,
  });
    return response.data;
};

// Upgrade or create membership
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