"use client"
import { logOut } from "@/service/auth.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: logOut,
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response?.message || "Logout failed");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["users"] });

      // সব cached query clear করো
      // queryClient.clear();

      toast.success("Logged out successfully");

      // login page এ redirect
      router.push("/login");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  return { logout, isLoggingOut };
};