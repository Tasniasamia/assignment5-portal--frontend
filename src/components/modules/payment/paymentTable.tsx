// paymentTable.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/common/table/dataTable";
import { getAllPaymentsAdmin, TPayment, TPaymentQueryParams } from "@/service/payment.service";
import { paymentColumns } from "./paymentColumns";
import { useSearchParams } from "next/navigation";

export default function PaymentTable() {
  const searchParams = useSearchParams();

  const params: TPaymentQueryParams = {
    page: Number(searchParams.get("page") ?? 1),
    limit: Number(searchParams.get("limit") ?? 10),
    sortBy: searchParams.get("sortBy") ?? undefined,
    sortOrder: (searchParams.get("sortOrder") as any) ?? undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["admin-payments", params],
    queryFn: () => getAllPaymentsAdmin(params),
  });

  const payments = data?.data?.data ?? [];
  const meta = data?.data?.meta;

  return (
    <DataTable
      data={payments}
      columns={paymentColumns as ColumnDef<TPayment>[]}
      loading={isLoading}
      meta={meta}
      searchable={false}
      emptyMessage="No payments found"
    />
  );
}