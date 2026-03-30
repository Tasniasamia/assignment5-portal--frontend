"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, Clock, XCircle } from "lucide-react";
import { toast } from "sonner";
import { approveIdea, underReviewIdea, rejectIdea, TIdea } from "@/service/idea.service";

type TAction = "approve" | "under-review" | "reject";

interface StatusUpdateModalProps {
  idea: TIdea;
  open: boolean;
  action: TAction;
  onClose: () => void;
}

const ACTION_CONFIG = {
  approve: {
    label: "Approve Idea",
    description: "Are you sure you want to approve this idea?",
    buttonLabel: "Approve",
    icon: CheckCircle,
    buttonClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
  },
  "under-review": {
    label: "Mark as Under Review",
    description: "This idea will be marked as under review.",
    buttonLabel: "Under Review",
    icon: Clock,
    buttonClass: "bg-blue-600 hover:bg-blue-700 text-white",
  },
  reject: {
    label: "Reject Idea",
    description: "Please provide feedback for the rejection.",
    buttonLabel: "Reject",
    icon: XCircle,
    buttonClass: "bg-red-600 hover:bg-red-700 text-white",
  },
};

export default function StatusUpdateModal({
  idea,
  open,
  action,
  onClose,
}: StatusUpdateModalProps) {
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState("");
  const config = ACTION_CONFIG[action];
  const Icon = config.icon;

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (action === "approve") return approveIdea(idea.id);
      if (action === "under-review") return underReviewIdea(idea.id);
      if (action === "reject") {
        if (!feedback.trim()) throw new Error("Feedback is required");
        return rejectIdea({ id: idea.id, rejectionFeedback: feedback });
      }
    },
    onSuccess: () => {
      toast.success(`Idea ${action === "under-review" ? "marked as under review" : action + "d"} successfully!`);
      queryClient.invalidateQueries({ queryKey: ["admin-ideas"] });
      setFeedback("");
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-full rounded-xl bg-white">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Icon className="h-5 w-5" />
            {config.label}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <p className="text-sm text-muted-foreground">
            {config.description}
          </p>
          <div className="rounded-lg bg-gray-50 p-3 text-sm">
            <span className="font-medium">Idea:</span> {idea.title}
          </div>

          {action === "reject" && (
            <div className="space-y-1.5">
              <Label>Rejection Feedback <span className="text-red-500">*</span></Label>
              <Textarea
                placeholder="Explain why this idea is being rejected..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button
              className={config.buttonClass}
              onClick={() => mutate()}
              disabled={isPending}
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {config.buttonLabel}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}