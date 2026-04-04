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
  searchTerm?: string;
  status?: string;
  categoryId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  type?:string|undefined
[key: string]: string | number | undefined;
}


export const getAllIdeas = async (params: TIdeaQueryParams = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.searchTerm) query.set("searchTerm", params.searchTerm);
  if (params.status) query.set("status", params.status);
  if (params.categoryId) query.set("categoryId", params.categoryId);
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortOrder) query.set("sortOrder", params.sortOrder);
    if (params.type) query.set("type", params.type);

console.log("query",query)
  const response = await httpClient.get<{ data: TIdea[]; meta: any }>(
    `/idea?${query.toString()}`
  );
  
  if (!response.success) throw new Error("Failed to fetch ideas");
  return response;
};












// ✅ GET ALL IDEAS (ADMIN)
export const getAllAdminIdeas = async (params: TIdeaQueryParams = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.searchTerm) query.set("searchTerm", params.searchTerm);
  if (params.status) query.set("status", params.status);
  if (params.categoryId) query.set("categoryId", params.categoryId);
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortOrder) query.set("sortOrder", params.sortOrder);
console.log("query",query)
  const response = await httpClient.get<{ data: TIdea[]; meta: any }>(
    `/idea/admin?${query.toString()}`
  );
  
  if (!response.success) throw new Error("Failed to fetch ideas");
  return response;
};


// ✅ GET ALL IDEAS (MEMBER)
export const getAllRoleWiseIdeas = async (params: TIdeaQueryParams = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.searchTerm) query.set("searchTerm", params.searchTerm);
  if (params.status) query.set("status", params.status);
  if (params.categoryId) query.set("categoryId", params.categoryId);
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortOrder) query.set("sortOrder", params.sortOrder);

console.log("query",query)
  const response = await httpClient.get<{ data: TIdea[]; meta: any }>(
    `/idea/roleWise?${query.toString()}`
  );
  
  if (!response.success) throw new Error("Failed to fetch ideas");
  return response;
};











// ✅ GET IDEA BY ID
export const getIdeaById = async (id: string) => {
  try{
  const response = await httpClient.get<TIdea>(`/idea/${id}`);
  return response;
  }
  catch (error: any) {
    const message = error?.response?.data?.message  || "Failed to get idea";
    // console.log("message",error)
    throw new Error(message);
  }
};

// ✅ CREATE IDEA (multipart/form-data)
export const createIdea = async (formData: FormData) => {
  try{
  const response = await httpClient.postForm<TIdea>("/idea", formData);
  return response;
    } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || "Failed to update idea";
    throw new Error(message);
  }
};

// ✅ UPDATE IDEA
export const updateIdea = async ({ id, formData }: { id: string; formData: FormData }) => {
  try {
    const response = await httpClient.patchForm<TIdea>(`/idea/${id}`, formData);
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || "Failed to update idea";
    throw new Error(message);
  }
};

// ✅ DELETE IDEA
export const deleteIdea = async (id: string) => {
  try{
  const response = await httpClient.delete<any>(`/idea/${id}`);
  if (!response.success) throw new Error("Failed to delete idea");
  return response;
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || "Failed to update idea";
    throw new Error(message);
  }
};

// ✅ APPROVE IDEA
export const approveIdea = async (id: string) => {
  try{
  const response = await httpClient.patch<any>(`/idea/${id}/approve`, {});
  // if (!response.success) throw new Error("Failed to approve idea");
  return response;
    } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || "Failed to update idea";
    throw new Error(message);
  }
};

// ✅ UNDER REVIEW
export const underReviewIdea = async (id: string) => {
  try{
  const response = await httpClient.patch<any>(`/idea/${id}/under-review`, {});
  // if (!response.success) throw new Error("Failed to update status");
  return response;
    } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || "Failed to update idea";
    throw new Error(message);
  }
};

// ✅ REJECT IDEA
export const rejectIdea = async ({
  id,
  rejectionFeedback,
}: {
  id: string;
  rejectionFeedback: string;
}) => {
  try{
  const response = await httpClient.patch<any>(`/idea/${id}/reject`, {
    rejectionFeedback,
  });
  // if (!response.success) throw new Error("Failed to reject idea");
  return response;
  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || "Failed to update idea";
    throw new Error(message);
  }


};