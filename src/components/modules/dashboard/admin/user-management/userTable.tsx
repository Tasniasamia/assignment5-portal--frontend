"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import DataTable from "@/components/common/table/dataTable";
import { deleteUser, getAllUsers, TUser, TUserQueryParams } from "@/service/dashboard.service";
import UserFilterPanel from "./userFilterPanel";
import UserActionModal from "./userActionModal";
import { userColumns } from "./userColumn";

type TModalState = {
  user: TUser;
  action: "status" | "role";
} | null;

export default function UserTable() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [modalState, setModalState] = useState<TModalState>(null);

  // ✅ URL params থেকে query বানাও
  const params: TUserQueryParams = {
    page: Number(searchParams.get("page") ?? 1),
    limit: Number(searchParams.get("limit") ?? 10),
    search: searchParams.get("searchTerm") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    role: searchParams.get("role") ?? undefined,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => getAllUsers(params),
  });

  const users = data?.data?.data ?? [];
  const meta = data?.data?.meta;

  // ✅ Delete
  const { mutate: handleDelete } = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete user");
    },
  });

  // ✅ Extra action columns — status & role update
  const actionColumns: ColumnDef<TUser>[] = [
  {
    id: "statusAction",
    header: "Change Status",
    enableSorting: false,
    cell: ({ row }) => {
      const isDeleted = row.original.status === "DELETED";
      const isActive = row.original.status === "ACTIVE";

      return (
        <button
          disabled={isDeleted}
          onClick={() =>
            !isDeleted && setModalState({ user: row.original, action: "status" })
          }
          className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors
            ${
              isDeleted
                ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                : isActive
                ? "bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 cursor-pointer"
            }`}
        >
          {isDeleted ? "Deleted" : isActive ? "Block" : "Activate"}
        </button>
      );
    },
  },
  {
    id: "roleAction",
    header: "Change Role",
    enableSorting: false,
    cell: ({ row }) => {
      const isDeleted = row.original.status === "DELETED";

      return (
        <button
          disabled={isDeleted}
          onClick={() =>
            !isDeleted && setModalState({ user: row.original, action: "role" })
          }
          className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors
            ${
              isDeleted
                ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                : "bg-purple-50 text-purple-700 hover:bg-purple-100 cursor-pointer"
            }`}
        >
          {row.original.role === "ADMIN" ? "Make Member" : "Make Admin"}
        </button>
      );
    },
  },
   {
    id: "deleteAction",
    header: "Delete",
    enableSorting: false,
    cell: ({ row }) => {
      const isDeleted = row.original.status === "DELETED";

      if (isDeleted) {
        return (
          <span className="text-xs text-gray-300 px-2.5 py-1">—</span>
        );
      }

      return (
        <button
          onClick={() => handleDelete(row.original.id)}
          className="text-xs px-2.5 py-1 rounded-full font-medium cursor-pointer transition-colors bg-red-50 text-red-500 hover:bg-red-100"
        >
          Delete
        </button>
      );
    },
  },
];

  return (
    <div>
      <DataTable
        data={users}
        columns={[...userColumns, ...actionColumns] as ColumnDef<TUser>[]}
        loading={isLoading}
        meta={meta}
        searchable={true}
        searchPlaceholder="Search users..."
        filterPanel={<UserFilterPanel />}
      
        emptyMessage="No users found"
      />

      {modalState && (
        <UserActionModal
          user={modalState.user}
          open={!!modalState}
          action={modalState.action}
          onClose={() => setModalState(null)}
        />
      )}
    </div>
  );
}