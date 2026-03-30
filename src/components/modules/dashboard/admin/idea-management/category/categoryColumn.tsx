// categoryColumn.tsx
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";

export interface TIdeaCategory {
  id: string;
  name: string;
  description: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const ideaCategoryColumns: ColumnDef<TIdeaCategory>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="font-medium">{row.original.name}</span>
    ),
  },
  {
    id: "description",
    accessorKey: "description",
    header: "Description",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.description}
      </span>
    ),
  },
  {
    id: "isDeleted",
    accessorKey: "isDeleted",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => {
      const isDeleted = row.original.isDeleted;
      return (
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            isDeleted
              ? "bg-red-100 text-red-600"
              : "bg-emerald-100 text-emerald-600"
          }`}
        >
          {isDeleted ? "Deleted" : "Active"}
        </span>
      );
    },
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
  {
    id: "updatedAt",
    accessorKey: "updatedAt",
    header: "Updated At",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {dayjs(row.original.updatedAt).format("DD MMM YYYY")}
      </span>
    ),
  },
];