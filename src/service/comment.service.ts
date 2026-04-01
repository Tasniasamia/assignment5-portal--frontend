"use server";
import { httpClient } from "@/lib/axios/httpClient";

export interface TCommentAuthor {
  id: string;
  name: string;
  image: string | null;
}

export interface TComment {
  id: string;
  content: string;
  ideaId: string;
  authorId: string;
  parentId: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: TCommentAuthor;
  replies?: TComment[];
  _count?: { replies: number };
}

// ✅ GET COMMENTS BY IDEA
export const getCommentsByIdea = async (ideaId: string) => {
  try {
    const response = await httpClient.get<{ data: TComment[]; meta: any }>(
      `/comments/${ideaId}`
    );
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message || "Failed to fetch comments";
    throw new Error(message);
  }
};

// ✅ CREATE COMMENT
export const createComment = async ({
  ideaId,
  payload,
}: {
  ideaId: string;
  payload: { content: string; parentId?: string };
}) => {
  try {
    const response = await httpClient.post<TComment>(`/comments/${ideaId}`, payload);
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message || "Failed to post comment";
    throw new Error(message);
  }
};

// ✅ DELETE COMMENT
export const deleteComment = async (id: string) => {
  try {
    const response = await httpClient.delete<any>(`/comments/${id}`);
    return response;
  } catch (error: any) {
    const message = error?.response?.data?.message || "Failed to delete comment";
    throw new Error(message);
  }
};