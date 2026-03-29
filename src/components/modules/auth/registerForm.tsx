"use client";
import { createRegisterAction } from "@/app/(site)/(auth)/register/_actions";
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
import {
  ILoginPayloadType,
  IRegisterPayloadType,
  IRegisterResponse,
} from "@/types/auth.types";
import { authValidationSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const RegisterForm = () => {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { mutateAsync, isPending } = useMutation<
    IRegisterResponse | ApiErrorResponse,
    Error,
    IRegisterPayloadType
  >({
    mutationFn: (values: IRegisterPayloadType) => createRegisterAction(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }: { value: ILoginPayloadType }) => {
      try {
        setServerError(null);
        const registerResponse: any = await mutateAsync(value as any);
        console.log("registerResponse", registerResponse);
        if (!registerResponse.success) {
          toast.error(registerResponse?.message);
          return;
        }
        router.push(`/verify-otp?email=${value?.email}`);

        toast.success("Please verify your email");
      } catch (error: any) {
        toast.success(error?.message);
      }
    },
  });
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-xl border-white rounded-2xl">
        <CardHeader>
          <h1 className="text-3xl font-bold text-center text-gray-800 mt-2">
            Welcome Back 👋
          </h1>
          <p className="text-center text-gray-500 text-sm mt-1">
            Please create your account
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
              name="name"
              validators={{
                onChange: authValidationSchema.registerSchema.shape.name,
              }}
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <AppField
                    field={field}
                    label="Name"
                    type="text"
                    placeholder="Enter your name "
                    className="p-3"
                    // disabled
                  />
                );
              }}
            />
            <form.Field
              name="email"
              validators={{
                onChange: authValidationSchema.registerSchema.shape.email,
              }}
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <AppField
                    field={field}
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email address"
                    className="p-3"
                    // disabled
                  />
                );
              }}
            />
            <form.Field
              name="password"
              validators={{
                onChange: authValidationSchema.registerSchema.shape.password,
              }}
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <AppField
                    field={field}
                    aria-label={
                      showPassword ? "Show Password" : "Hide Password"
                    }
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="p-3"
                    // disabled
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
                );
              }}
            />

            {serverError && (
              <Alert>
                <AlertDescription className="mx-4">
                  {serverError}
                </AlertDescription>
              </Alert>
            )}

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <>
                  <AppSubmitButton
                    className="w-full bg-[var(--forest)] text-white "
                    isPending={isSubmitting || isPending}
                    pendingLabel="Creating User ..."
                    disabled={!canSubmit}
                  >
                    Register
                  </AppSubmitButton>
                </>
              )}
            />
          </form>
          <Button
            variant="outline"
            className="w-full my-4 cursor-pointer"
            onClick={() => {
              window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login/google`;
            }}
          >
            Sign Up With Google
          </Button>
        </CardContent>

        <CardFooter className="justify-center pb-5">
          <p className="text-sm text-gray-500">
            Aready have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              login here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterForm;
