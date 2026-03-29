import React from "react";
import VerifyOtpForm from "@/components/modules/auth/verifyOtpForm";
import PageBanner from "@/components/common/banner";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchQueries = await searchParams;
  
  return (
    <div>
        <PageBanner title="Verify OTP"/>
    
      <VerifyOtpForm email={searchQueries.email as string} type="forget-password"/>
    </div>
  );
}
