"use server";
import { httpClient } from "@/lib/axios/httpClient";

export const createPayment = async (data: { ideaId: string }) => {
  try {
    const response = await httpClient.post<any>(
      "/payments/initiate",
      data
    );
    console.log("response",response);
    return response;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to payment for idea";
    throw new Error(message);
  }
};



export const verifyPayment = async (id: string) => {
  try{
  const response = await httpClient.get<any>(`/payments/verify/${id}`);
  return response;
  }
  catch (error: any) {
    const message = error?.response?.data?.message  || "Failed to verify payment";
    // console.log("message",error)
    throw new Error(message);
  }
};


export type TPaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export type TPayment = {
  id: string;
  amount: number;
  status: TPaymentStatus;
  invoiceUrl?: string;
  stripeEventId?: string;
  createdAt: string;
  updatedAt: string;
  idea: {
    id: string;
    title: string;
    images: string[];
    type: string;
    price?: number;
  };
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
};

export type TPaymentQueryParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};


export const getAllPaymentsAdmin = async (params: TPaymentQueryParams = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortOrder) query.set("sortOrder", params.sortOrder);

  const response = await httpClient.get<{ data: TPayment[]; meta: any }>(
    `/idea/payments/admin?${query.toString()}`
  );
  if (!response.success) throw new Error("Failed to fetch payments");
  return response;
};


export const getMyPayments = async (params: TPaymentQueryParams = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const response = await httpClient.get<{ data: TPayment[]; meta: any }>(
    `/idea/bought?${query.toString()}`
  );
  if (!response.success) throw new Error("Failed to fetch payments");
  return response;
};


export const getMySoldPayments = async (params: TPaymentQueryParams = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const response = await httpClient.get<{ data: TPayment[]; meta: any }>(
    `/idea/sold?${query.toString()}`
  );
  if (!response.success) throw new Error("Failed to fetch sold payments");
  return response;
};