// "use client";
// import { createRegisterAction } from "@/app/(site)/(auth)/register/_actions";
// import AppField from "@/components/common/form/AppField";
// import AppSubmitButton from "@/components/common/form/AppSubmitButton";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
// } from "@/components/ui/card";
// import { changePassword } from "@/service/auth.service";
// import { ApiErrorResponse } from "@/types/api.types";
// import {
//   ILoginPayloadType,
//   IRegisterPayloadType,
//   IRegisterResponse,
// } from "@/types/auth.types";
// import { authValidationSchema } from "@/zod/auth.validation";
// import { useForm } from "@tanstack/react-form";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { Eye, EyeOff } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { toast } from "sonner";

// const ChangePasswordForm = () => {
//   const queryClient = useQueryClient();
//   const [serverError, setServerError] = useState<string | null>(null);
//   const [showPassword, setShowPassword] = useState<boolean>(false);

//   const { mutateAsync, isPending } = useMutation<
//     IRegisterResponse | ApiErrorResponse,
//     Error,
//     {currentPassword:string,newPassword:string}
//   >({
//     mutationFn: (values: {currentPassword:string,newPassword:string}) => changePassword(values),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["users"] });
//     },
//   });
//   const router = useRouter();

//   const form = useForm({
//     defaultValues: {
      
//       currentPassword: "",
//       newPassword: "",
//     },
//     onSubmit: async ({ value }: { value: {currentPassword:string,newPassword:string} }) => {
//       try {
//         setServerError(null);
//         const response: any = await mutateAsync(value as any);
//         console.log("response", response);
//         if (!response.success) {
//           toast.error(response?.message);
//           return;
//         }
        

//         toast.success(response?.message);
//       } catch (error: any) {
//         toast.success(error?.message);
//       }
//     },
//   });
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <Card className="w-full max-w-md shadow-xl border-white rounded-2xl">
//         <CardHeader>
        
//           <p className="text-center text-gray-500 text-sm mt-1">
//             Change Your Password
//           </p>
//         </CardHeader>

//         <CardContent>
//           <form
//             action="#"
//             method="POST"
//             noValidate
//             onSubmit={(e) => {
//               e.preventDefault();
//               e.stopPropagation();
//               form.handleSubmit();
//             }}
//             className="space-y-4"
//           >
       
       
//             <form.Field
//               name="currentPassword"
//               validators={{
//                 onChange: authValidationSchema.registerSchema.shape.password,
//               }}
//               children={(field) => {
//                 const isInvalid =
//                   field.state.meta.isTouched && !field.state.meta.isValid;
//                 return (
//                   <AppField
//                     field={field}
//                     aria-label={
//                       showPassword ? "Show Password" : "Hide Password"
//                     }
//                     label="Current Password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Enter your password"
//                     className="p-3"
//                     // disabled
//                     append={
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="icon"
//                         className="cursor-pointer"
//                         onClick={() => setShowPassword(!showPassword)}
//                       >
//                         {showPassword ? (
//                           <EyeOff className="size-4" aria-hidden="true" />
//                         ) : (
//                           <Eye className="size-4" aria-hidden="true" />
//                         )}
//                       </Button>
//                     }
//                   />
//                 );
//               }}
//             />
//      <form.Field
//               name="newPassword"
//               validators={{
//                 onChange: authValidationSchema.registerSchema.shape.password,
//               }}
//               children={(field) => {
//                 const isInvalid =
//                   field.state.meta.isTouched && !field.state.meta.isValid;
//                 return (
//                   <AppField
//                     field={field}
//                     aria-label={
//                       showPassword ? "Show Password" : "Hide Password"
//                     }
//                     label="New Password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Enter your password"
//                     className="p-3"
//                     // disabled
//                     append={
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="icon"
//                         className="cursor-pointer"
//                         onClick={() => setShowPassword(!showPassword)}
//                       >
//                         {showPassword ? (
//                           <EyeOff className="size-4" aria-hidden="true" />
//                         ) : (
//                           <Eye className="size-4" aria-hidden="true" />
//                         )}
//                       </Button>
//                     }
//                   />
//                 );
//               }}
//             />
//             {serverError && (
//               <Alert>
//                 <AlertDescription className="mx-4">
//                   {serverError}
//                 </AlertDescription>
//               </Alert>
//             )}

//             <form.Subscribe
//               selector={(state) => [state.canSubmit, state.isSubmitting]}
//               children={([canSubmit, isSubmitting]) => (
//                 <>
//                   <AppSubmitButton
//                     className="w-full bg-[var(--forest)] text-white "
//                     isPending={isSubmitting || isPending}
//                     pendingLabel="Saving ..."
//                     disabled={!canSubmit}
//                   >
//                     Save
//                   </AppSubmitButton>
//                 </>
//               )}
//             />
//           </form>
          
//         </CardContent>

  
//       </Card>
//     </div>
//   );
// };

// export default ChangePasswordForm;


"use client";
import { createRegisterAction } from "@/app/(site)/(auth)/register/_actions";
import AppField from "@/components/common/form/AppField";
import AppSubmitButton from "@/components/common/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { changePassword } from "@/service/auth.service";
import { ApiErrorResponse } from "@/types/api.types";
import {
  ILoginPayloadType,
  IRegisterPayloadType,
  IRegisterResponse,
} from "@/types/auth.types";
import { authValidationSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, KeyRound, Lock, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const ChangePasswordForm = () => {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState<boolean>(false);
  const [showNew, setShowNew] = useState<boolean>(false);
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation<
    IRegisterResponse | ApiErrorResponse,
    Error,
    { currentPassword: string; newPassword: string }
  >({
    mutationFn: (values: { currentPassword: string; newPassword: string }) =>
      changePassword(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
    onSubmit: async ({
      value,
    }: {
      value: { currentPassword: string; newPassword: string };
    }) => {
      try {
        setServerError(null);
        const response: any = await mutateAsync(value as any);
        if (!response.success) {
          toast.error(response?.message);
          return;
        }
        toast.success(response?.message);
      } catch (error: any) {
        toast.error(error?.message);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f7f2] px-4 relative overflow-hidden">

      {/* ── background decoration ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* large blurred circle top-left */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#1a4a2e]/8 blur-3xl" />
        {/* large blurred circle bottom-right */}
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#1a4a2e]/6 blur-3xl" />
        {/* subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #1a4a2e 1.2px, transparent 1.2px)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      {/* ── card ── */}
      <div className="relative w-full max-w-sm">

        {/* icon badge floating above */}
        <div className="flex justify-center mb-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1a4a2e] shadow-xl shadow-[#1a4a2e]/30">
            <KeyRound size={28} className="text-[#6db87a]" />
          </div>
        </div>

        {/* main card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-black/8 border border-[#e2ebe0]">

          {/* ── header ── */}
          <div className="relative bg-gradient-to-br from-[#1a4a2e] to-[#0f3020] px-6 pt-6 pb-8 overflow-hidden">
            {/* texture */}
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #fff 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />
            <div className="absolute -top-6 -right-6 h-28 w-28 rounded-full bg-white/5" />
            <div className="absolute -bottom-8 -left-4 h-20 w-20 rounded-full bg-white/5" />
            <div className="relative">
              <h1 className="text-xl font-bold text-white tracking-tight">
                Change Password
              </h1>
              <p className="mt-1 text-[13px] text-[#7ec98a] leading-snug">
                Update your credentials to stay secure
              </p>
            </div>
          </div>

          {/* ── form body ── */}
          <div className="px-6 pt-6 pb-7">
            <form
              action="#"
              method="POST"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-5"
            >

              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#6b8f71]">
                  <Lock size={10} />
                  Current Password
                </label>
                <form.Field
                  name="currentPassword"
                  validators={{
                    onChange:
                      authValidationSchema.registerSchema.shape.password,
                  }}
                  children={(field) => (
                    <AppField
                      field={field}
                      aria-label={showCurrent ? "Hide Password" : "Show Password"}
                      label=""
                      type={showCurrent ? "text" : "password"}
                      placeholder="Enter current password"
                      className="p-3 rounded-xl border-[#dde8d8] focus:border-[#1a4a2e] focus:ring-[#1a4a2e]/10 bg-[#fafcf9] text-[#1a2e1d] placeholder:text-[#b0c4ae] text-sm"
                      append={
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer text-[#8faa8e] hover:text-[#1a4a2e] hover:bg-transparent"
                          onClick={() => setShowCurrent(!showCurrent)}
                        >
                          {showCurrent ? (
                            <EyeOff className="size-4" aria-hidden="true" />
                          ) : (
                            <Eye className="size-4" aria-hidden="true" />
                          )}
                        </Button>
                      }
                    />
                  )}
                />
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#6b8f71]">
                  <ShieldCheck size={10} />
                  New Password
                </label>
                <form.Field
                  name="newPassword"
                  validators={{
                    onChange:
                      authValidationSchema.registerSchema.shape.password,
                  }}
                  children={(field) => (
                    <AppField
                      field={field}
                      aria-label={showNew ? "Hide Password" : "Show Password"}
                      label=""
                      type={showNew ? "text" : "password"}
                      placeholder="Enter new password"
                      className="p-3 rounded-xl border-[#dde8d8] focus:border-[#1a4a2e] focus:ring-[#1a4a2e]/10 bg-[#fafcf9] text-[#1a2e1d] placeholder:text-[#b0c4ae] text-sm"
                      append={
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer text-[#8faa8e] hover:text-[#1a4a2e] hover:bg-transparent"
                          onClick={() => setShowNew(!showNew)}
                        >
                          {showNew ? (
                            <EyeOff className="size-4" aria-hidden="true" />
                          ) : (
                            <Eye className="size-4" aria-hidden="true" />
                          )}
                        </Button>
                      }
                    />
                  )}
                />
              </div>

              {/* server error */}
              {serverError && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                  <span className="text-xs text-red-600">{serverError}</span>
                </div>
              )}

              {/* tip */}
              <div className="flex items-start gap-2 rounded-xl bg-[#f0f8f2] border border-[#d4e9d8] px-3.5 py-3">
                <ShieldCheck size={14} className="text-[#2d7a4a] mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-[#4a7a58] leading-relaxed">
                  Use a mix of uppercase, lowercase, numbers and symbols for a strong password.
                </p>
              </div>

              {/* submit */}
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <AppSubmitButton
                    className="w-full bg-[#1a4a2e] hover:bg-[#153d25] text-white font-semibold rounded-xl py-3 text-sm tracking-wide transition-all duration-200 shadow-lg shadow-[#1a4a2e]/20 hover:shadow-[#1a4a2e]/30 disabled:opacity-50"
                    isPending={isSubmitting || isPending}
                    pendingLabel="Saving..."
                    disabled={!canSubmit}
                  >
                    Update Password
                  </AppSubmitButton>
                )}
              />
            </form>
          </div>
        </div>

        {/* back link */}
        <div className="mt-4 text-center">
          <button
            onClick={() => router.back()}
            className="text-[12px] font-medium text-[#6b8f71] hover:text-[#1a4a2e] transition-colors"
          >
            ← Go back
          </button>
        </div>

      </div>
    </div>
  );
};

export default ChangePasswordForm;