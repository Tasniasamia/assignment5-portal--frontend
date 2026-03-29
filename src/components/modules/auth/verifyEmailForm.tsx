"use client";

import { createLoginAction } from "@/app/(site)/(auth)/login/_action";
import AppField from "@/components/common/form/AppField";
import AppSubmitButton from "@/components/common/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { verifyEmail } from "@/service/auth.service";
import { ApiErrorResponse } from "@/types/api.types";
import {
  TVerifyEmailPayload,
  TVerifyEmailResponse,
} from "@/types/auth.types";
import { authValidationSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const VerifiedEmailForm = ({ redirect }: { redirect?: string | object }) => {
  console.log("redirect", redirect);

  const queryClient = useQueryClient();
  const { push } = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);

  const { mutateAsync, isPending } = useMutation<
    TVerifyEmailResponse | ApiErrorResponse,
    Error,
    TVerifyEmailPayload
  >({
    mutationFn: (values: TVerifyEmailPayload) => verifyEmail(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }: { value: { email: string } }) => {
      try {
        const verifyEmailResposne = await mutateAsync(value);

        if (
          "success" in verifyEmailResposne &&
          !verifyEmailResposne.success
        ) {
          setServerError(verifyEmailResposne.message);
          return;
        }

        toast.success(verifyEmailResposne.message);
        push(`/verify-email?email=${value.email}`);
      } catch (error: unknown) {
        if (error && typeof error === "object" && "message" in error) {
          toast.error(
            (error as { message?: string }).message ??
              "An unexpected error occurred"
          );
        } else {
          toast.error("An unexpected error occurred");
        }
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <h1 className="text-3xl font-bold text-center text-gray-800 mt-2">
            Verify Email 👋
          </h1>
          <p className="text-center text-gray-500 text-sm mt-1">
            Please verify your email
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
            <form.Field
              name="email"
              validators={{
                onChange: authValidationSchema.loginSchema.shape.email,
              }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email address"
                  className="p-3"
                />
              )}
            </form.Field>

            {/* Server Error */}
            {serverError && (
              <Alert>
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <form.Subscribe
              selector={(state) => [
                state.canSubmit,
                state.isSubmitting,
              ]}
            >
              {([canSubmit, isSubmitting]) => (
                <AppSubmitButton
                  isPending={isSubmitting || isPending}
                  pendingLabel="Submitting..."
                  disabled={!canSubmit}
                  className="w-full bg-[var(--forest)] text-white"
                >
                  Submit
                </AppSubmitButton>
              )}
            </form.Subscribe>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifiedEmailForm;