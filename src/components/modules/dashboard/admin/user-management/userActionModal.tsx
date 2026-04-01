"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  TUser,
  TUserRole,
  TUserStatus,
  updateUserRole,
  updateUserStatus,
} from "@/service/dashboard.service";

type TActionType = "status" | "role";

interface UserActionModalProps {
  user: TUser;
  open: boolean;
  action: TActionType;
  onClose: () => void;
}

export default function UserActionModal({
  user,
  open,
  action,
  onClose,
}: UserActionModalProps) {
  const queryClient = useQueryClient();

  const [selectedStatus, setSelectedStatus] = useState<TUserStatus>(
    user.status
  );
  const [selectedRole, setSelectedRole] = useState<TUserRole>(user.role);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (action === "status") {
        return updateUserStatus({ userId: user.id, status: selectedStatus });
      } else {
        return updateUserRole({ userId: user.id, role: selectedRole });
      }
    },
    onSuccess: () => {
      toast.success(
        action === "status" ? "Status updated!" : "Role updated!"
      );
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-xl">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="text-lg font-semibold">
            {action === "status" ? "Update User Status" : "Update User Role"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* User info */}
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                {user.name?.[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Status selector */}
          {action === "status" && (
            <div className="space-y-1.5">
              <Label>New Status</Label>
              <Select
                value={selectedStatus}
                onValueChange={(val) => setSelectedStatus(val as TUserStatus)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="BLOCKED">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Role selector */}
          {action === "role" && (
            <div className="space-y-1.5">
              <Label>New Role</Label>
              <Select
                value={selectedRole}
                onValueChange={(val) => setSelectedRole(val as TUserRole)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="MEMBER">Member</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => mutate()}
              disabled={isPending}
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Update
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}