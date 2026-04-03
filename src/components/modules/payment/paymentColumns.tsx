"use client"
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import Image from "next/image";
import { TPayment } from "@/service/payment.service";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  SUCCESS: "bg-emerald-100 text-emerald-700",
  FAILED: "bg-red-100 text-red-700",
};

export const paymentColumns: ColumnDef<TPayment>[] = [
  {
    id: "idea",
    header: "Idea",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-2 min-w-[180px]">
        {row.original.idea?.images?.[0] && (
          <Image
            src={row.original.idea.images[0]}
            alt={row.original.idea.title}
            width={36}
            height={36}
            className="rounded-md object-cover h-9 w-9 shrink-0"
          />
        )}
        <span className="font-medium line-clamp-1">
          {row.original.idea?.title}
        </span>
      </div>
    ),
  },
  {
    id: "buyer",
    header: "Buyer",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="text-sm">
        <p className="font-medium">{row.original.user?.name}</p>
        <p className="text-muted-foreground text-xs">{row.original.user?.email}</p>
      </div>
    ),
  },
  {
    id: "amount",
    header: "Amount",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="font-semibold text-sm">${row.original.amount}</span>
    ),
  },
  {
    id: "status",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => (
      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[row.original.status] ?? "bg-gray-100 text-gray-600"}`}>
        {row.original.status}
      </span>
    ),
  },
  {
    id: "invoice",
    header: "Invoice",
    enableSorting: false,
    cell: ({ row }) =>
      row.original.invoiceUrl ? (
        
      <a    href={row.original.invoiceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline"
        >
          View Invoice
        </a>
      ) : (
        <span className="text-xs text-muted-foreground">—</span>
      ),
  },
  {
    id: "createdAt",
    header: "Date",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {dayjs(row.original.createdAt).format("DD MMM YYYY")}
      </span>
    ),
  },
];