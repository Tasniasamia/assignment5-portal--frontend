import React from "react";
import VerifyOtpForm from "@/components/modules/auth/verifyOtpForm";
import PageBanner from "@/components/common/banner";
import ResetPasswordForm from "@/components/modules/auth/resetPasswordForm";

// export default async function Page({
//   searchParams,
// }: {
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
// }) {
//   const searchQueries = await searchParams;
//   const email=searchQueries?.email;
//   const otp=searchQueries?.otp;
//   console.log("email ",email,"otp",otp);

//   return (
//     <div>
//     <PageBanner title="Reset Password"/>
//     <ResetPasswordForm email={email as string} otp={otp as string}/>
//     </div>
//   );
// }


export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchQueries = await searchParams;
  
  // ✅ decode করে নাও
  const email = decodeURIComponent(searchQueries?.email as string ?? "");
  const otp = decodeURIComponent(searchQueries?.otp as string ?? "");
  
  console.log("email", email, "otp", otp);

  return (
    <div>
      <PageBanner title="Reset Password" />
      <ResetPasswordForm email={email} otp={otp} />
    </div>
  );
}