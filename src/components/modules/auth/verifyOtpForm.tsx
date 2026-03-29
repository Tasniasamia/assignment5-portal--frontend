"use client";

import AppSubmitButton from "@/components/common/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useForm } from "@tanstack/react-form";
import React, { useState } from "react";
import InputOTPPattern from "@/components/common/form/OtpField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TResendOTPResponse, TVerifyResponse } from "@/types/auth.types";
import { ApiErrorResponse } from "@/types/api.types";
import { resendOTP, verifyOtpWithEmailAction } from "@/service/auth.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const VerifyOtpForm = ({ email, type }: { email: string; type: string }) => {


        console.log("type for registration:  ",type);
        console.log("email for registration: ",email);

  const [serverError, setServerError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const route = useRouter();

  const { mutateAsync, isPending } = useMutation<
    TVerifyResponse | ApiErrorResponse,
    Error,
    { otp: string; email: string }
  >({
    mutationFn: (values: { otp: string; email: string }) =>
      verifyOtpWithEmailAction(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const { mutateAsync: resendOtpMutation, isPending: isResendOTPPending } =
    useMutation<
      TResendOTPResponse | ApiErrorResponse,
      Error,
      { type: string; email: string }
    >({
      mutationFn: (values: { type: string; email: string }) =>
        resendOTP(values),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    });
  const form = useForm({
    defaultValues: {
      otp: "",
      email: email ?? "",
    },
    onSubmit: async ({ value }) => {
      try {
        


        if (type && type === "forget-password") {
          // route.push(`/reset-password?email=${email}&otp=${value?.otp}`);

route.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(value?.otp)}`);



          return;
        } else if (type && type === "email-verification") {

          setServerError(null);

          if (!email) {
            setServerError("Email is required for OTP verification");
            return;
          }

          if (value.otp.length < 6) {
            setServerError("OTP must be 6 digits");
            return;
          }

          console.log("OTP Submitted:", value.otp);

          const verifyEmailResponse = await mutateAsync(value);

          if (
            "success" in verifyEmailResponse &&
            !verifyEmailResponse.success
          ) {
            console.log(
              "loginResponse not success: ",
              verifyEmailResponse.message,
            );
            toast.error(verifyEmailResponse.message);
            return;
          }

          route.push("/login");
          toast.success(verifyEmailResponse?.message);
        }
      } catch (error: unknown) {
        toast.error("OTP verification failed");
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <h1 className="text-3xl font-bold text-center text-gray-800 mt-2">
            Verify OTP 🔐
          </h1>
          <p className="text-center text-gray-500 text-sm mt-1">
            Enter the 6 digit code sent to your email
          </p>
        </CardHeader>

        <CardContent>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            {/* OTP FIELD */}
            <form.Field
              name="otp"
              validators={{
                onChange: ({ value }) =>
                  value.length < 6 ? "OTP must be 6 digits" : undefined,
              }}
            >
              {(field) => <InputOTPPattern field={field} label="Enter OTP" />}
            </form.Field>

            {/* ERROR */}
            {serverError && (
              <Alert>
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            {/* SUBMIT BUTTON */}
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <AppSubmitButton
                  isPending={isSubmitting}
                  pendingLabel="Verifying..."
                  disabled={!canSubmit}
                  className="w-full bg-[var(--forest)] text-white "
                >
                  Verify OTP
                </AppSubmitButton>
              )}
            </form.Subscribe>
          </form>
        </CardContent>

        <CardFooter className="justify-center pb-5">
          <p className="text-sm text-gray-500">
            Didn’t receive code?{" "}
            {isResendOTPPending ? (
              <span className="text-blue-600 font-medium ">Resending...</span>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  if (!email) {
                    toast.error("Email is required to resend OTP");
                    return;
                  }

                  const resendOTPResponse = await resendOtpMutation({
                    email: email ?? "",
                    type:
                      type === "forget-password"
                        ? "forget-password"
                        : "email-verification",
                  });
                  console.log("resendOTPResponse", resendOTPResponse);
                  if (
                    "success" in resendOTPResponse &&
                    !resendOTPResponse.success
                  ) {
                    toast.error(resendOTPResponse.message);
                    return;
                  }

                  toast.success(resendOTPResponse?.message);
                }}
                className="text-blue-600 cursor-pointer font-medium hover:underline"
              >
                Resend
              </button>
            )}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyOtpForm;
