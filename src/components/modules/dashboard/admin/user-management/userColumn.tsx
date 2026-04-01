import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { TUser } from "@/service/dashboard.service";
import Image from "next/image";

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  BLOCKED: "bg-red-100 text-red-700",
  DELETED: "bg-gray-100 text-gray-500",
};

const ROLE_STYLES: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-700",
  MEMBER: "bg-blue-100 text-blue-700",
};

export const userColumns: ColumnDef<TUser>[] = [
  {
    id: "user",
    accessorKey: "name",
    header: "User",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-3 min-w-[200px]">
        {row.original.image ? (
          <Image
            src={row.original.image}
            alt={row.original.name}
            width={36}
            height={36}
            className="rounded-full object-cover h-9 w-9 shrink-0"
          />
        ) : (
          <div className="h-9 w-9 shrink-0 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-sm font-bold">
            {row.original.name?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}
        <div>
          <p className="font-medium text-sm">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      </div>
    ),
  },
  {
    id: "role",
    accessorKey: "role",
    header: "Role",
    enableSorting: false,
    cell: ({ row }) => (
      <span
        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
          ROLE_STYLES[row.original.role] ?? "bg-gray-100 text-gray-600"
        }`}
      >
        {row.original.role}
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
        {row.original.status}
      </span>
    ),
  },
  {
    id: "emailVerified",
    accessorKey: "emailVerified",
    header: "Verified",
    enableSorting: false,
    cell: ({ row }) => (
      <span
        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
          row.original.emailVerified
            ? "bg-emerald-50 text-emerald-600"
            : "bg-yellow-50 text-yellow-600"
        }`}
      >
        {row.original.emailVerified ? "✓ Verified" : "Pending"}
      </span>
    ),
  },
  {
    id: "ideas",
    header: "Ideas",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-sm text-center block">
        {row.original._count?.ideas ?? 0}
      </span>
    ),
  },
  {
    id: "votes",
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
    header: "Joined",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {dayjs(row.original.createdAt).format("DD MMM YYYY")}
      </span>
    ),
  },
];