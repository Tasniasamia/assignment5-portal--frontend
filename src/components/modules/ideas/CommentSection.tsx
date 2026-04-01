"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast } from "sonner";
import {
  createComment,
  deleteComment,
  getCommentsByIdea,
  type TComment,
} from "@/service/comment.service";

dayjs.extend(relativeTime);

// ─── Single Comment Card ───────────────────────────────────────────────────────
const CommentCard = ({
  comment,
  ideaId,
  currentUserId,
}: {
  comment: TComment;
  ideaId: string;
  currentUserId?: string;
}) => {
  const queryClient = useQueryClient();
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");

  // ── Post reply
  const { mutateAsync: postReply, isPending: isReplying } = useMutation({
    mutationFn: createComment,
  });

  // ── Delete comment
  const { mutateAsync: removeComment, isPending: isDeleting } = useMutation({
    mutationFn: deleteComment,
  });

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;
    try {
      const res = await postReply({
        ideaId,
        payload: { content: replyText.trim(), parentId: comment.id },
      });
      if (!res?.success) {
        toast.error("Failed to post reply");
        return;
      }
      toast.success("Reply posted!");
      setReplyText("");
      setShowReplyBox(false);
      queryClient.invalidateQueries({ queryKey: ["comments", ideaId] });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await removeComment(comment.id);
      if (!res?.success) {
        toast.error("Failed to delete comment");
        return;
      }
      toast.success("Comment deleted");
      queryClient.invalidateQueries({ queryKey: ["comments", ideaId] });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const isOwner = currentUserId && comment.authorId === currentUserId;

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="flex-shrink-0">
        {comment.author?.image ? (
          <img
            src={comment.author.image}
            alt={comment.author.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-bold">
            {comment.author?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-semibold text-gray-800">
              {comment.author?.name}
            </span>
            <span className="text-[10px] text-gray-400">
              {dayjs(comment.createdAt).fromNow()}
            </span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-1 px-1">
          <button
            onClick={() => setShowReplyBox((prev) => !prev)}
            className="text-[11px] text-green-600 hover:text-green-800 font-medium transition-colors"
          >
            Reply
          </button>
          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-[11px] text-red-400 hover:text-red-600 font-medium transition-colors disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>

        {/* Reply input */}
        {showReplyBox && (
          <div className="mt-2 flex gap-2">
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleReplySubmit()}
              placeholder="Write a reply..."
              className="flex-1 text-sm border border-green-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-300 bg-white"
            />
            <button
              onClick={handleReplySubmit}
              disabled={isReplying || !replyText.trim()}
              className="px-3 py-2 bg-green-500 text-white text-xs font-semibold rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {isReplying ? "..." : "Send"}
            </button>
          </div>
        )}

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3 border-l-2 border-green-100 pl-4">
            {comment.replies.map((reply) => (
              <CommentCard
                key={reply.id}
                comment={reply}
                ideaId={ideaId}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Comment Section ──────────────────────────────────────────────────────
const CommentSection = ({
  ideaId,
  currentUserId,
}: {
  ideaId: string;
  currentUserId?: string; // session থেকে pass করো
}) => {
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["comments", ideaId],
    queryFn: () => getCommentsByIdea(ideaId),
  });

  const { mutateAsync: postComment, isPending } = useMutation({
    mutationFn: createComment,
  });

  const comments: TComment[] = (data?.data as any)?.data ?? data?.data ?? [];

  const handleSubmit = async () => {
    if (!commentText.trim()) return;

    if (!currentUserId) {
      toast.error("Please login to comment");
      return;
    }

    try {
      const res = await postComment({
        ideaId,
        payload: { content: commentText.trim() },
      });

      if (!res?.success) {
        toast.error("Failed to post comment");
        return;
      }

      toast.success("Comment posted!");
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["comments", ideaId] });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="px-6 pb-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-bold text-gray-700">💬 Comments</h3>
        <span className="bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
          {comments.length}
        </span>
      </div>

      {/* Comment Input */}
      <div className="flex gap-3 items-start">
        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-bold">
          You
        </div>
        <div className="flex-1 space-y-2">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            className="w-full text-sm border border-green-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-300 bg-white resize-none"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isPending || !commentText.trim()}
              className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {isPending ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      {isLoading ? (
        <p className="text-sm text-gray-400 text-center py-4">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">
          No comments yet. Be the first!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              ideaId={ideaId}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;