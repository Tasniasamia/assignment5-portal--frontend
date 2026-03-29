"use client";
import AppField from "@/components/common/form/AppField";
import AppSubmitButton from "@/components/common/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { resetPassword } from "@/service/auth.service";
import { ApiErrorResponse } from "@/types/api.types";
import { TResetPasswordResponse } from "@/types/auth.types";
import { authValidationSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const ResetPasswordForm = ({ email, otp }: { email: string; otp: string }) => {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const {push}=useRouter()

  const { mutateAsync, isPending } = useMutation<
    TResetPasswordResponse | ApiErrorResponse,
    Error,
    { email: string; otp: string; password: string }
  >({
    mutationFn: (values) => resetPassword(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
  const form = useForm({
    defaultValues: {
      email: email ?? "",
      otp: otp ?? "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const { confirmPassword, ...submitData } = value; // confirmPassword বাদ দিয়ে submit
        console.log("submitData",submitData);
        
        const resetPasswordResponse = await mutateAsync(
          {email:email??" ",otp:otp??" ",password:submitData.password} as { email: string; otp: string; password: string },
        );
        console.log("resetPasswordResponse", resetPasswordResponse);
        if (!resetPasswordResponse.success) {
          toast.error(resetPasswordResponse.message);
          return;
        }
        toast.success(resetPasswordResponse?.message || 'OTP verified Successfully');
        push('/login');
        
      } catch (error: unknown) {
        if (error && typeof error === "object" && "message" in error) {
          toast.error(
            (error as { message?: string }).message ??
              "An unexpected error occurred",
          );
        } else {
          toast.error("An unexpected error occurred");
        }
      }
    },
  });
  // const form = useForm({
  //   defaultValues: {
  //     email:email?? "",
  //     otp: otp ?? "",
  //     password: "", // শুধু UI validation এর জন্য
  //   },
  //   onSubmit: async ({ value }) => {
  //     try {
  //       setServerError(null);

  //       // confirmPassword বাদ দিয়ে submit করা হচ্ছে
  //       // const { password } = value;

  //       const resetPasswordResponse = await mutateAsync(
  //         value as { email: string; otp: string; password: string }
  //       );

  //       if (
  //         "success" in resetPasswordResponse &&
  //         !resetPasswordResponse.success
  //       ) {
  //         setServerError(resetPasswordResponse.message);
  //         return;
  //       }
  //     } catch (error: unknown) {
  //       if (error && typeof error === "object" && "message" in error) {
  //         setServerError(
  //           (error as { message?: string }).message ??
  //             "An unexpected error occurred"
  //         );
  //       } else {
  //         setServerError("An unexpected error occurred");
  //       }
  //     }
  //   },
  // });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <h1 className="text-3xl font-bold text-center text-gray-800 mt-2">
            Reset Password 🔒
          </h1>
          <p className="text-center text-gray-500 text-sm mt-1">
            Enter your new password
          </p>
        </CardHeader>

        <CardContent>
          <form
            action="#"
            method="POST"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            {/* Password Field */}
            <form.Field
              name="password"
              validators={{
                onChange: authValidationSchema.loginSchema.shape.password,
              }}
            >
              {(field) => (
                <AppField
                  field={field}
                  className="p-3"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  append={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" aria-hidden="true" />
                      ) : (
                        <Eye className="size-4" aria-hidden="true" />
                      )}
                    </Button>
                  }
                />
              )}
            </form.Field>

            {/* Confirm Password Field */}
            <form.Field
              name="confirmPassword"
              validators={{
                onChangeListenTo: ["password"], // password field change হলে re-validate করবে
                onChange: ({ value, fieldApi }) => {
                  const password = fieldApi.form.getFieldValue("password");
                  if (!value) return "Confirm password is required";
                  if (value !== password) return "Passwords do not match";
                  return undefined;
                },
              }}
            >
              {(field) => (
                <AppField
                  field={field}
                  className="p-3"
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your new password"
                  append={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-4" aria-hidden="true" />
                      ) : (
                        <Eye className="size-4" aria-hidden="true" />
                      )}
                    </Button>
                  }
                />
              )}
            </form.Field>

            {serverError && (
              <Alert>
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <AppSubmitButton
                  isPending={isSubmitting || isPending}
                  pendingLabel="Resetting..."
                  disabled={!canSubmit}
                  className="w-full bg-[var(--forest)] text-white"
                >
                  Reset Password
                </AppSubmitButton>
              )}
            </form.Subscribe>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordForm;
