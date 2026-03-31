"use client";

import { verifyPayment } from "@/service/payment.service";
import { useQuery } from "@tanstack/react-query";

const SuccessPayment = ({ id }: { id: string }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["payment", id],
    queryFn: () => verifyPayment(id),
    enabled: !!id, // ✅ important
  });

  if (isLoading) {
    return <div className="p-10 text-center">Verifying payment...</div>;
  }

  if (error) {
    return <div className="p-10 text-red-500">Payment verification failed</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-2">
          Payment Successful 🎉
        </h1>
        <p className="text-gray-500">
          Your payment has been verified successfully.
        </p>
      </div>
    </div>
  );
};

export default SuccessPayment;