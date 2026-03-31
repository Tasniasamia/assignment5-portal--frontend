// components/modules/ideas/VoteButtons.tsx
"use client";

import { useState } from "react";
import { castVote, deleteVote, getVoteCount } from "@/service/public.idea.service";

interface VoteData {
  upvotes: number;
  downvotes: number;
  total: number;
  userVote: "UPVOTE" | "DOWNVOTE" | null;
}

interface VoteButtonsProps {
  ideaId: string;
  initialData: VoteData;
  onAuthRequired?: () => void;
}

export default function VoteButtons({
  ideaId,
  initialData,
  onAuthRequired,
}: VoteButtonsProps) {
  const [data, setData] = useState<VoteData>(initialData);
  const [loading, setLoading] = useState(false);

  const isLoggedIn = () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("token");
  };

  const handleVote = async (type: "UPVOTE" | "DOWNVOTE") => {
    if (!isLoggedIn()) {
      onAuthRequired?.();
      return;
    }
    setLoading(true);
    try {
      if (data.userVote === type) {
        // toggle off — remove vote
        await deleteVote(ideaId);
        setData((prev) => ({
          ...prev,
          upvotes: type === "UPVOTE" ? prev.upvotes - 1 : prev.upvotes,
          downvotes: type === "DOWNVOTE" ? prev.downvotes - 1 : prev.downvotes,
          total: type === "UPVOTE" ? prev.total - 1 : prev.total + 1,
          userVote: null,
        }));
      } else {
        await castVote(ideaId, type);
        const prev = data.userVote;
        setData((d) => ({
          ...d,
          upvotes:
            type === "UPVOTE"
              ? d.upvotes + 1
              : prev === "UPVOTE"
              ? d.upvotes - 1
              : d.upvotes,
          downvotes:
            type === "DOWNVOTE"
              ? d.downvotes + 1
              : prev === "DOWNVOTE"
              ? d.downvotes - 1
              : d.downvotes,
          total:
            type === "UPVOTE"
              ? prev === "DOWNVOTE"
                ? d.total + 2
                : d.total + 1
              : prev === "UPVOTE"
              ? d.total - 2
              : d.total - 1,
          userVote: type,
        }));
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Upvote */}
      <button
        onClick={() => handleVote("UPVOTE")}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-150 disabled:opacity-60 ${
          data.userVote === "UPVOTE"
            ? "bg-green-100 border-green-500 text-green-700 shadow-sm shadow-green-200"
            : "bg-white border-gray-200 text-gray-500 hover:border-green-400 hover:text-green-600 hover:bg-green-50"
        }`}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 01.707.293l6 6a1 1 0 01-1.414 1.414L11 6.414V16a1 1 0 11-2 0V6.414L4.707 10.707A1 1 0 013.293 9.293l6-6A1 1 0 0110 3z"
            clipRule="evenodd"
          />
        </svg>
        <span>{data.upvotes}</span>
        <span className="text-xs opacity-70">Upvote</span>
      </button>

      {/* Score badge */}
      <div
        className={`px-3 py-1.5 rounded-full text-sm font-bold border ${
          data.total > 0
            ? "bg-green-50 border-green-200 text-green-700"
            : data.total < 0
            ? "bg-red-50 border-red-200 text-red-600"
            : "bg-gray-50 border-gray-200 text-gray-500"
        }`}
      >
        {data.total > 0 ? "+" : ""}
        {data.total}
      </div>

      {/* Downvote */}
      <button
        onClick={() => handleVote("DOWNVOTE")}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-150 disabled:opacity-60 ${
          data.userVote === "DOWNVOTE"
            ? "bg-red-100 border-red-400 text-red-600 shadow-sm shadow-red-100"
            : "bg-white border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50"
        }`}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 17a1 1 0 01-.707-.293l-6-6a1 1 0 011.414-1.414L9 13.586V4a1 1 0 112 0v9.586l4.293-4.293a1 1 0 011.414 1.414l-6 6A1 1 0 0110 17z"
            clipRule="evenodd"
          />
        </svg>
        <span>{data.downvotes}</span>
        <span className="text-xs opacity-70">Downvote</span>
      </button>
    </div>
  );
}
