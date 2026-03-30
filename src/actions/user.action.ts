"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserInfo } from "@/service/auth.service";
import { deleteProfileImageService } from "@/service/profile.service";
import { toast } from "sonner";

// ✅ profile fetch hook
export const useProfile = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getUserInfo(),
  });
};

// ✅ delete image hook
export const useDeleteImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProfileImageService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Image deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete image");
    },
  });
};