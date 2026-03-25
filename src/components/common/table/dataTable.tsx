"use client";

import React, { ReactNode } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "./tablePagination";
import SearchInput from "./searchInput";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ActionsType<T> {
  onEdit?: (payload: T) => void;
  onView?: (payload: T) => void;
  onDelete?: (payload: T) => void;
}

interface ICustomTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  actions?: ActionsType<TData>;
  loading: boolean;
  emptyMessage?: string;
  meta?: IMeta;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchable?: boolean;
  searchPlaceholder?: string;
  filterPanel?: ReactNode; // ✅ filter component slot
  toolbarAction?: ReactNode;
}

export default function DataTable<TData>({
  data,
  columns,
  actions,
  loading,
  emptyMessage,
  meta,
  sortBy,
  sortOrder,
  searchable = false,
  searchPlaceholder,
  filterPanel,
  toolbarAction
}: ICustomTableProps<TData>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        params.set(key, value);
      });
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const sorting: SortingState =
    sortBy ? [{ id: sortBy, desc: sortOrder === "desc" }] : [];

  const handleSortingChange = (
    updater: SortingState | ((prev: SortingState) => SortingState),
  ) => {
    const newSorting =
      typeof updater === "function" ? updater(sorting) : updater;
    if (newSorting.length === 0) {
      updateParams({ sortBy: "createdAt", sortOrder: "desc", page: "1" });
    } else {
      const { id, desc } = newSorting[0];
      updateParams({ sortBy: id, sortOrder: desc ? "desc" : "asc", page: "1" });
    }
  };

  const actionColumn: ColumnDef<TData> = {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    cell: (info) => (
      <div className="flex gap-2">
        {actions?.onEdit && (
          <button type="button" className="cursor-pointer px-3 py-1 text-sm rounded hover:bg-gray-200 transition-colors" onClick={() => actions.onEdit?.(info.row.original)}>Edit</button>
        )}
        {actions?.onView && (
          <button type="button" className="cursor-pointer px-3 py-1 text-sm rounded hover:bg-gray-200 transition-colors" onClick={() => actions.onView?.(info.row.original)}>View</button>
        )}
        {actions?.onDelete && (
          <button type="button" className="cursor-pointer px-3 py-1 text-sm rounded hover:bg-red-100 hover:text-red-600 transition-colors" onClick={() => actions.onDelete?.(info.row.original)}>Delete</button>
        )}
      </div>
    ),
  };

  const newColumns = actions ? [...columns, actionColumn] : columns;

  const table = useReactTable({
    data,
    columns: newColumns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    state: { sorting },
    onSortingChange: handleSortingChange,
  });

  return (
    <div className="relative w-full space-y-3">

     {(searchable || filterPanel || toolbarAction) && (
        <div className="flex items-center justify-between gap-2">
          {/* বাম — search + filter */}
          <div className="flex items-center gap-2">
            {searchable && (
              <SearchInput placeholder={searchPlaceholder ?? "Search..."} />
            )}
            {filterPanel && filterPanel}
          </div>
 
          {/* ডান — Add button বা যেকোনো action */}
          {toolbarAction && (
            <div className=" ">
              {toolbarAction}
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </div>
        </div>
      )}

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.column.getCanSort() ? (
                      <button type="button" className="flex items-center gap-1 hover:text-foreground transition-colors select-none" onClick={header.column.getToggleSortingHandler()}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === "asc" ? (
                          <ArrowUp className="h-3.5 w-3.5" />
                        ) : header.column.getIsSorted() === "desc" ? (
                          <ArrowDown className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                        )}
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={newColumns.length} className="h-24 text-center">
                  {emptyMessage || "No data available."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {meta && (
        <Pagination
          page={meta.page}
          limit={meta.limit}
          total={meta.total}
          totalPages={meta.totalPages}
        />
      )}
    </div>
  );
}