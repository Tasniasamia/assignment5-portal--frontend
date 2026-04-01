"use server";

import { httpClient } from "@/lib/axios/httpClient";

export const createVote = async ({
  id,
  payload,
}: {
  id: string;
  payload: { type: "UPVOTE" };
}) => {
  try {
    const response = await httpClient.post<any>(`/votes/${id}`, payload);
    console.log("response ",response);
    return response;
  } catch (error: any) {
    console.log("coming to catch")
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to vote";
    throw new Error(message);
  }
};