import React from "react";
import VerifyOtpForm from "@/components/modules/auth/verifyOtpForm";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchQueries = await searchParams;
  
  return (
    <div>
      <VerifyOtpForm email={searchQueries.email as string} />
    </div>
  );
}
