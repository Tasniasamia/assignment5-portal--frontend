// myPaymentTable.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/common/table/dataTable";
import { getMyPayments, TPayment, TPaymentQueryParams } from "@/service/payment.service";
import { useSearchParams } from "next/navigation";
import { myPaymentColumns } from "./myPaymentColumn";

export default function MyPaymentTable() {
  const searchParams = useSearchParams();

  const params: TPaymentQueryParams = {
    page: Number(searchParams.get("page") ?? 1),
    limit: Number(searchParams.get("limit") ?? 10),
  };

  const { data, isLoading } = useQuery({
    queryKey: ["my-payments", params],
    queryFn: () => getMyPayments(params),
  });

  const payments = data?.data?.data ?? [];
  const meta = data?.data?.meta;

  return (
    <DataTable
      data={payments}
      columns={myPaymentColumns as ColumnDef<TPayment>[]}
      loading={isLoading}
      meta={meta}
      emptyMessage="You haven't purchased any ideas yet"
    />
  );
}