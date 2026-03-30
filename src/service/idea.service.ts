"use server";
import { httpClient } from "@/lib/axios/httpClient";

export type TIdeaStatus = "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
export type TIdeaType = "FREE" | "PAID";

export interface TIdea {
  id: string;
  title: string;
  problemStatement: string;
  proposedSolution: string;
  description: string;
  images: string[];
  status: TIdeaStatus;
  type: TIdeaType;
  price: number;
  rejectionFeedback: string | null;
  isPaid: boolean;
  viewCount: number;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  authorId: string;
  categoryId: string;
  category: { id: string; name: string; description: string };
  author: { id: string; name: string; email: string; role: string };
  _count: { votes: number; comments: number };
}

export interface TIdeaQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  categoryId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
[key: string]: string | number | undefined;
}

// ✅ GET ALL IDEAS (ADMIN)
export const getAllAdminIdeas = async (params: TIdeaQueryParams = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);
  if (params.categoryId) query.set("categoryId", params.categoryId);
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortOrder) query.set("sortOrder", params.sortOrder);

  const response = await httpClient.get<{ data: TIdea[]; meta: any }>(
    `/idea/admin?${query.toString()}`
  );
  if (!response.success) throw new Error("Failed to fetch ideas");
  return response;
};

// ✅ GET IDEA BY ID
export const getIdeaById = async (id: string) => {
  const response = await httpClient.get<TIdea>(`/idea/${id}`);
  if (!response.success) throw new Error("Failed to fetch idea");
  return response;
};

// ✅ CREATE IDEA (multipart/form-data)
export const createIdea = async (formData: FormData) => {
  const response = await httpClient.postForm<TIdea>("/idea", formData);
  if (!response.success) throw new Error("Failed to create idea");
  return response;
};

// ✅ UPDATE IDEA
export const updateIdea = async ({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}) => {
  const response = await httpClient.patchForm<TIdea>(`/idea/${id}`, formData);
  if (!response.success) throw new Error("Failed to update idea");
  return response;
};

// ✅ DELETE IDEA
export const deleteIdea = async (id: string) => {
  const response = await httpClient.delete<any>(`/idea/${id}`);
  if (!response.success) throw new Error("Failed to delete idea");
  return response;
};

// ✅ APPROVE IDEA
export const approveIdea = async (id: string) => {
  const response = await httpClient.patch<any>(`/idea/${id}/approve`, {});
  if (!response.success) throw new Error("Failed to approve idea");
  return response;
};

// ✅ UNDER REVIEW
export const underReviewIdea = async (id: string) => {
  const response = await httpClient.patch<any>(`/idea/${id}/under-review`, {});
  if (!response.success) throw new Error("Failed to update status");
  return response;
};

// ✅ REJECT IDEA
export const rejectIdea = async ({
  id,
  rejectionFeedback,
}: {
  id: string;
  rejectionFeedback: string;
}) => {
  const response = await httpClient.patch<any>(`/idea/${id}/reject`, {
    rejectionFeedback,
  });
  if (!response.success) throw new Error("Failed to reject idea");
  return response;
};