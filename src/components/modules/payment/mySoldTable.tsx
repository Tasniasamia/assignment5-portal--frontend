// mySoldTable.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/common/table/dataTable";
import { getMySoldPayments, TPayment, TPaymentQueryParams } from "@/service/payment.service";
import { soldColumns } from "./soldColumns";
import { useSearchParams } from "next/navigation";

export default function MySoldTable() {
  const searchParams = useSearchParams();

  const params: TPaymentQueryParams = {
    page: Number(searchParams.get("page") ?? 1),
    limit: Number(searchParams.get("limit") ?? 10),
  };

  const { data, isLoading } = useQuery({
    queryKey: ["my-sold", params],
    queryFn: () => getMySoldPayments(params),
  });

  const payments = data?.data?.data ?? [];
  const meta = data?.data?.meta;

  return (
    <DataTable
      data={payments}
      columns={soldColumns as ColumnDef<TPayment>[]}
      loading={isLoading}
      meta={meta}
      emptyMessage="No one has purchased your ideas yet"
    />
  );
}