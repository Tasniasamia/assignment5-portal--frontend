"use server";
import { httpClient } from "@/lib/axios/httpClient";

export const createPayment = async (formData: FormData) => {
  try{
  const response = await httpClient.post<{ideaId:string}>("/payments/initiate", formData);
  return response;
    } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || "Failed to payment for idea";
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