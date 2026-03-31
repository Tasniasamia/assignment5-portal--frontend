"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/common/table/dataTable";
import { toast } from "sonner";
import { deleteIdea, getAllAdminIdeas, TIdea, TIdeaQueryParams } from "@/service/idea.service";
import { ideaColumns } from "./ideaColumn";
import AddIdeaModal from "./addIdeaModal";
import EditIdeaModal from "./editIdeaModal";
import StatusUpdateModal from "./statusUpdateModal";
import IdeaFilterPanel from "./ideaFilterPanel";
import { getAllCategory } from "@/service/idea.catetogory.service";
import { useSearchParams } from "next/navigation";

export default function IdeaTable() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const [editingIdea, setEditingIdea] = useState<TIdea | null>(null);
  const [statusAction, setStatusAction] = useState<{
    idea: TIdea;
    action: "approve" | "under-review" | "reject";
  } | null>(null);

  // ✅ read URL params
  const params: TIdeaQueryParams = {
    page: Number(searchParams.get("page") ?? 1),
    limit: Number(searchParams.get("limit") ?? 10),
    searchTerm: searchParams.get("searchTerm") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    categoryId: searchParams.get("categoryId") ?? undefined,
    sortBy: searchParams.get("sortBy") ?? undefined,
    sortOrder: (searchParams.get("sortOrder") as any) ?? undefined,

  };

  const { data, isLoading } = useQuery({
    queryKey: ["admin-ideas", params],
    queryFn: () => getAllAdminIdeas(params),
  });

  const ideas = data?.data?.data ?? [];
  const meta = data?.data?.meta;

  // ✅ categories for filter
  const { data: categoryData } = useQuery({
    queryKey: ["category"],
    queryFn: getAllCategory,
  });
  const categories = categoryData?.data ?? [];

  // ✅ delete
  const { mutate: handleDelete } = useMutation({
    mutationFn: (id: string) => deleteIdea(id),
    onSuccess: () => {
      toast.success("Idea deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-ideas"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete idea");
    },
  });

  // ✅ extra action column for status update
  const statusColumn: ColumnDef<TIdea> = {
    id: "statusActions",
    header: "Change Status",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex gap-1.5 flex-wrap">
        <button
          type="button"
          onClick={() => setStatusAction({ idea: row.original, action: "approve" })}
          className="text-xs cursor-pointer px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
        >
          Approve
        </button>
        <button
          type="button"
          onClick={() => setStatusAction({ idea: row.original, action: "under-review" })}
          className="text-xs cursor-pointer px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
        >
          Review
        </button>
        <button
          type="button"
          onClick={() => setStatusAction({ idea: row.original, action: "reject" })}
          className="text-xs cursor-pointer px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
        >
          Reject
        </button>
      </div>
    ),
  };

  return (
    <div>
      <DataTable
        data={ideas}
        columns={[...ideaColumns, statusColumn] as ColumnDef<TIdea>[]}
        loading={isLoading}
        meta={meta}
        searchable={true}
        searchPlaceholder="Search ideas..."
        filterPanel={<IdeaFilterPanel categories={categories} />}
        toolbarAction={<AddIdeaModal />}
        actions={{
          onEdit: (idea) => setEditingIdea(idea),
          
          onDelete: (idea) => handleDelete(idea.id),
        }}
        emptyMessage="No ideas found"
      />

      {editingIdea && (
        <EditIdeaModal
          idea={editingIdea}
          open={!!editingIdea}
          onClose={() => setEditingIdea(null)}
        />
      )}

      {statusAction && (
        <StatusUpdateModal
          idea={statusAction.idea}
          open={!!statusAction}
          action={statusAction.action}
          onClose={() => setStatusAction(null)}
        />
      )}
    </div>
  );
}