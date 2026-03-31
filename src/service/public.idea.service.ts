// service/public.idea.service.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token"); // ← তোমার token storage অনুযায়ী change করো
};

const authHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// ─── IDEAS ────────────────────────────────────────────────
export interface IPublicIdeaParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  categoryId?: string;
  type?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  isPublished?: boolean;
  isDeleted?: boolean;
}

export const getAllPublicIdeas = async (params: IPublicIdeaParams) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "" && v !== null) query.set(k, String(v));
  });
  const res = await fetch(`${BASE_URL}/api/v1/ideas?${query}`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data.data; // { data: [...], meta: { page, limit, total, totalPages } }
};

// ─── VOTES ────────────────────────────────────────────────
export const getVoteCount = async (ideaId: string) => {
  const res = await fetch(`${BASE_URL}/api/v1/votes/${ideaId}`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  const data = await res.json();
  return data.data; // { upvotes, downvotes, total, userVote }
};

export const castVote = async (ideaId: string, type: "UPVOTE" | "DOWNVOTE") => {
  const res = await fetch(`${BASE_URL}/api/v1/votes/${ideaId}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ type }),
  });
  return res.json();
};

export const deleteVote = async (ideaId: string) => {
  const res = await fetch(`${BASE_URL}/api/v1/votes/${ideaId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.json();
};

// ─── COMMENTS ─────────────────────────────────────────────
export interface ICommentParams {
  page?: number;
  limit?: number;
}

export const getCommentsByIdea = async (
  ideaId: string,
  params: ICommentParams = {}
) => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  const res = await fetch(`${BASE_URL}/api/v1/comments/${ideaId}?${query}`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  const data = await res.json();
  return data.data; // { data: [...], meta: {...} }
};

export const createComment = async (
  ideaId: string,
  payload: { content: string; parentId?: string }
) => {
  const res = await fetch(`${BASE_URL}/api/v1/comments/${ideaId}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to post comment");
  return data.data;
};

export const deleteComment = async (commentId: string) => {
  const res = await fetch(`${BASE_URL}/api/v1/comments/${commentId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return res.json();
};
