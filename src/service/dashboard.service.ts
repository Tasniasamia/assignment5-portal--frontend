"use server";
import { httpClient } from "@/lib/axios/httpClient";

export type TUserRole = "ADMIN" | "MEMBER";
export type TUserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export interface TUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: TUserRole;
  status: TUserStatus;
  emailVerified: boolean;
  createdAt: string;
  _count: { ideas: number; votes: number; comments: number };
}

export interface TAdminStats {
  totalUsers: number;
  totalIdeas: number;
  totalVotes: number;
  totalComments: number;
  totalPayments: number;
  ideaStats: {
    pending: number;
    approved: number;
    rejected: number;
    underReview: number;
  };
}

export interface TUserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  role?: string;
  [key: string]: string | number | undefined;
}

// ✅ GET ADMIN STATS
export const getAdminStats = async () => {
  try {
    const response = await httpClient.get<TAdminStats>("/dashboard/admin/stats");
    return response;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch stats");
  }
};

// ✅ GET MEMBER STATS
export const getMemberStats = async () => {
  try {
    const response = await httpClient.get<any>("/dashboard/member/stats");
    return response;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch stats");
  }
};

// ✅ GET ALL USERS (ADMIN)
export const getAllUsers = async (params: TUserQueryParams = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);
  if (params.role) query.set("role", params.role);

  const response = await httpClient.get<{ data: TUser[]; meta: any }>(
    `/dashboard/admin/users?${query.toString()}`
  );
  if (!response.success) throw new Error("Failed to fetch users");
  return response;
};

// ✅ UPDATE USER STATUS
export const updateUserStatus = async ({
  userId,
  status,
}: {
  userId: string;
  status: TUserStatus;
}) => {
  try {
    const response = await httpClient.patch<TUser>(
      `/dashboard/admin/users/${userId}/status`,
      { status }
    );
    return response;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to update status");
  }
};

// ✅ UPDATE USER ROLE
export const updateUserRole = async ({
  userId,
  role,
}: {
  userId: string;
  role: TUserRole;
}) => {
  try {
    const response = await httpClient.patch<TUser>(
      `/dashboard/admin/users/${userId}/role`,
      { role }
    );
    return response;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to update role");
  }
};

// ✅ DELETE USER
export const deleteUser = async (userId: string) => {
  try {
    const response = await httpClient.delete<any>(
      `/dashboard/admin/users/${userId}`
    );
    return response;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to delete user");
  }
};