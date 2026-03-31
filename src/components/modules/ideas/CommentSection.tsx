// components/modules/ideas/CommentSection.tsx
"use client";

import { useState, useEffect } from "react";
import {
  getCommentsByIdea,
  createComment,
  deleteComment,
} from "@/service/public.idea.service";

const LIMIT = 5;

const timeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const avatarInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

const isLoggedIn = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("token");
};

// ─── SINGLE COMMENT ──────────────────────────────────────
interface CommentItemProps {
  comment: any;
  ideaId: string;
  depth?: number;
  onDeleted: (id: string) => void;
  onReplied: (reply: any, parentId: string) => void;
}

function CommentItem({
  comment,
  ideaId,
  depth = 0,
  onDeleted,
  onReplied,
}: CommentItemProps) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const handleReply = async () => {
    if (!replyText.trim() || !isLoggedIn()) return;
    setSubmitting(true);
    try {
      const newReply = await createComment(ideaId, {
        content: replyText,
        parentId: comment.id,
      });
      onReplied(newReply, comment.id);
      setReplyText("");
      setShowReply(false);
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this comment?")) return;
    try {
      await deleteComment(comment.id);
      onDeleted(comment.id);
    } catch (e) {
      console.error(e);
    }
  };

  const replies: any[] = comment.replies || [];

  return (
    <div className={`${depth > 0 ? "ml-8 mt-2" : "mt-4"}`}>
      {/* Comment bubble */}
      <div
        className={`rounded-xl px-4 py-3 ${
          depth === 0
            ? "bg-green-50 border border-green-100"
            : "bg-white border border-gray-100"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {comment.author?.image ? (
              <img
                src={comment.author.image}
                className="w-7 h-7 rounded-full object-cover"
                alt=""
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                {avatarInitials(comment.author?.name)}
              </div>
            )}
            <span className="text-sm font-semibold text-green-800">
              {comment.author?.name}
            </span>
            <span className="text-xs text-gray-400">
              {timeAgo(comment.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isLoggedIn() && depth < 2 && (
              <button
                onClick={() => setShowReply(!showReply)}
                className="text-xs text-green-600 font-medium hover:text-green-800 transition-colors"
              >
                ↩ Reply
              </button>
            )}
            {isLoggedIn() && (
              <button
                onClick={handleDelete}
                className="text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
      </div>

      {/* Reply input */}
      {showReply && isLoggedIn() && (
        <div className="ml-8 mt-2 flex gap-2 items-center">
          <input
            autoFocus
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleReply()}
            placeholder={`Reply to ${comment.author?.name}...`}
            className="flex-1 text-sm px-4 py-2 rounded-full border border-green-200 focus:outline-none focus:border-green-400 bg-green-50 placeholder-gray-400"
          />
          <button
            onClick={handleReply}
            disabled={submitting || !replyText.trim()}
            className="px-4 py-2 bg-green-600 text-white text-xs font-semibold rounded-full hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? "..." : "Send"}
          </button>
          <button
            onClick={() => { setShowReply(false); setReplyText(""); }}
            className="px-3 py-2 bg-gray-100 text-gray-500 text-xs rounded-full hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Replies */}
      {replies.length > 0 && (
        <div className="ml-4 mt-1 border-l-2 border-green-100 pl-3">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-xs text-green-600 font-medium mb-2 hover:text-green-800"
          >
            {showReplies ? "▼" : "▶"} {replies.length}{" "}
            {replies.length === 1 ? "reply" : "replies"}
          </button>
          {showReplies &&
            replies.map((reply: any) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                ideaId={ideaId}
                depth={depth + 1}
                onDeleted={onDeleted}
                onReplied={onReplied}
              />
            ))}
        </div>
      )}
    </div>
  );
}

// ─── COMMENT SECTION ─────────────────────────────────────
interface CommentSectionProps {
  ideaId: string;
  totalComments: number;
}

export default function CommentSection({
  ideaId,
  totalComments,
}: CommentSectionProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [count, setCount] = useState(totalComments);

  const fetchComments = async (p = 1, append = false) => {
    if (p === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const data = await getCommentsByIdea(ideaId, { page: p, limit: LIMIT });
      if (append) {
        setComments((prev) => [...prev, ...(data?.data || [])]);
      } else {
        setComments(data?.data || []);
      }
      setTotalPages(data?.meta?.totalPages || 1);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    fetchComments(1);
  }, [ideaId]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchComments(next, true);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!isLoggedIn()) {
      alert("Please login to comment.");
      return;
    }
    setSubmitting(true);
    try {
      const created = await createComment(ideaId, { content: newComment });
      setComments((prev) => [created, ...prev]);
      setNewComment("");
      setCount((c) => c + 1);
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  };

  const handleDeleted = (id: string) => {
    const removeById = (list: any[]): any[] =>
      list
        .filter((c) => c.id !== id)
        .map((c) => ({
          ...c,
          replies: c.replies ? removeById(c.replies) : [],
        }));
    setComments(removeById);
    setCount((c) => Math.max(0, c - 1));
  };

  const handleReplied = (reply: any, parentId: string) => {
    const addReply = (list: any[]): any[] =>
      list.map((c) =>
        c.id === parentId
          ? { ...c, replies: [...(c.replies || []), reply] }
          : { ...c, replies: c.replies ? addReply(c.replies) : [] }
      );
    setComments(addReply);
    setCount((c) => c + 1);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-base font-bold text-green-800">Comments</h3>
        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          {count}
        </span>
      </div>

      {/* Add comment */}
      <div className="flex gap-3 mb-5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-0.5">
          Me
        </div>
        <div className="flex-1 flex gap-2">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && handleAddComment()
            }
            placeholder={
              isLoggedIn() ? "Write a comment..." : "Login to comment..."
            }
            disabled={!isLoggedIn()}
            className="flex-1 text-sm px-4 py-2.5 rounded-full border border-green-200 focus:outline-none focus:border-green-400 bg-green-50 placeholder-gray-400 disabled:opacity-60"
          />
          <button
            onClick={handleAddComment}
            disabled={submitting || !newComment.trim() || !isLoggedIn()}
            className="px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-full hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? "..." : "Post"}
          </button>
        </div>
      </div>

      {/* Comment list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-green-50 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <div className="text-3xl mb-2">💬</div>
          <p className="text-sm">No comments yet. Be the first!</p>
        </div>
      ) : (
        <>
          {comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              ideaId={ideaId}
              onDeleted={handleDeleted}
              onReplied={handleReplied}
            />
          ))}

          {/* Show More */}
          {page < totalPages && (
            <div className="flex justify-center mt-5">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-green-200 text-green-700 text-sm font-semibold rounded-full hover:border-green-400 hover:bg-green-50 disabled:opacity-50 transition-all"
              >
                {loadingMore ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Loading...
                  </>
                ) : (
                  <>Show More Comments ↓</>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
