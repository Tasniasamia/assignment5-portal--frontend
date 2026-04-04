import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { TIdea } from "@/service/idea.service";
import Image from "next/image";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  UNDER_REVIEW: "bg-blue-100 text-blue-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
};

export const ideaColumns: ColumnDef<TIdea>[] = [
  {
    id: "title",
    accessorKey: "title",
    header: "Title",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-2 min-w-[180px]">
        {row.original.images?.[0] && (
          <Image
            src={row.original.images[0]}
            alt={row.original.title}
            width={36}
            height={36}
            className="rounded-md object-cover h-9 w-9 shrink-0"
          />
        )}
        <span className="font-medium line-clamp-1">{row.original.title}</span>
      </div>
    ),
  },
  {
    id: "category",
    accessorKey: "category",
    header: "Category",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.category?.name ?? "—"}
      </span>
    ),
  },
  {
    id: "author",
    accessorKey: "author",
    header: "Author",
    enableSorting: false,
    cell: ({ row }) => { 
      console.log("author",row.original.author?.name)
      return (
      <div className="text-sm">
        <p className="font-medium">{row.original.author?.name}</p>
        <p className="text-muted-foreground text-xs">{row.original.author?.email}</p>
      </div>
    )},
  },
  {
    id: "type",
    accessorKey: "type",
    header: "Type",
    enableSorting: false,
    cell: ({ row }) => (
      <span
        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
          row.original.type === "PAID"
            ? "bg-purple-100 text-purple-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {row.original.type === "PAID"
          ? `Paid • $${row.original.price}`
          : "Free"}
      </span>
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => (
      <span
        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
          STATUS_STYLES[row.original.status] ?? "bg-gray-100 text-gray-600"
        }`}
      >
        {row.original.status.replace("_", " ")}
      </span>
    ),
  },
  {
    id: "votes",
    accessorKey: "_count",
    header: "Votes",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-sm text-center block">
        {row.original._count?.votes ?? 0}
      </span>
    ),
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created At",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {dayjs(row.original.createdAt).format("DD MMM YYYY")}
      </span>
    ),
  },
];