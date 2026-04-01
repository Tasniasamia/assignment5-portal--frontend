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
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginPayloadType, ILoginResponse } from "@/types/auth.types";
import { authValidationSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

const LoginForm = ({ redirect }: { redirect?: string | object }) => {
  console.log("redirect", redirect);
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { mutateAsync, isPending } = useMutation<
    ILoginResponse | ApiErrorResponse,
    Error,
    ILoginPayloadType
  >({
    mutationFn: (values: ILoginPayloadType) =>
      createLoginAction(values, redirect as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }: { value: ILoginPayloadType }) => {
      try {
        // setServerError(null);
    
        const loginResponse = await mutateAsync(value);
    
        if ("success" in loginResponse && !loginResponse.success) {
          console.log("coming here");
          console.log("loginResponse not success: ", loginResponse.message);
          toast.error(loginResponse.message || "Login failed");
          // setServerError(loginResponse.message);
          return;
        }
      } catch (error: unknown) {
        if (error && typeof error === "object" && "message" in error) {
          console.log("catch message", (error as { message?: string }).message);
          toast.error(
            (error as { message?: string }).message ??
              "An unexpected error occurred",
          );
        } else {
          console.log("catch message", error);
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
            Welcome Back 👋
          </h1>
          <p className="text-center text-gray-500 text-sm mt-1">
            Please login to your account
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
                  aria-label={showPassword ? "Show Password" : "Hide Password"}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
            {/* Forget Password */}
            <div className="text-right">
              <Link
                href={`/forget-password`}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

          

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}

            >
              {([canSubmit, isSubmitting]) => (
                <AppSubmitButton
                  isPending={isSubmitting || isPending}
                  pendingLabel="Logging In ..."
                  disabled={!canSubmit}
                    className="w-full bg-[var(--forest)] text-white "

                >
                  Login
                </AppSubmitButton>
              )}
            </form.Subscribe>
          </form>
          <Button
            variant="outline"
            className="w-full my-4 cursor-pointer"
            onClick={() => {
              window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login/google`;

              // window.location.href=`http://localhost:5050/api/v1/auth/login/google`
            }}
          >
            Sign In With Google
          </Button>
        </CardContent>

        <CardFooter className="justify-center pb-5">
          <p className="text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
