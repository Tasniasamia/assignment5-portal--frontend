"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "@/components/common/table/dataTable";
import { toast } from "sonner";
import { deleteIdea,  getAllRoleWiseIdeas,  TIdea, TIdeaQueryParams } from "@/service/idea.service";
import { ideaColumns } from "./ideaColumn";
import AddIdeaModal from "./addIdeaModal";
import EditIdeaModal from "./editIdeaModal";
import IdeaFilterPanel from "./ideaFilterPanel";
import { getAllCategory } from "@/service/idea.catetogory.service";
import { useSearchParams } from "next/navigation";
import StatusUpdateModal from "../../admin/idea-management/statusUpdateModal";

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
    queryFn: () => getAllRoleWiseIdeas(params),
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



  return (
    <div>
      <DataTable
        data={ideas}
        columns={[...ideaColumns] as ColumnDef<TIdea>[]}
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