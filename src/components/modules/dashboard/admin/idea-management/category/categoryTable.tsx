

// "use client";

// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import React, { useState } from "react";
// import { ColumnDef } from "@tanstack/react-table";
// import DataTable from "@/components/common/table/dataTable";
// // import FilterPanel, { FilterFieldConfig } from "@/components/shared/table/filterPanel";

// import { toast } from "sonner";
// import { deleteCategory, getAllCategory } from "@/service/idea.catetogory.service";
// import { TIdeaCategory } from "@/types/idea.category.type";
// import { ideaCategoryColumns } from "./categoryColumn";
// import AddCategoryModal from "./addCategoryModal";


// const CategoryTable = () => {
//   const queryClient = useQueryClient();

//   const { data, isLoading } = useQuery({
//     queryKey: ["category"],
//     queryFn: () => getAllCategory(),
//   });

//   const [editingCategory, setEditingCategory] = useState<TIdeaCategory | null>(null);

//   // ✅ delete mutation
//   const { mutate: handleDelete } = useMutation({
//     mutationFn: (id: string) => deleteCategory(id),
//     onSuccess: () => {
//       toast.success("Category deleted successfully");
//       queryClient.invalidateQueries({ queryKey: ["category"] });
//     },
//     onError: (error: any) => {
//       toast.error(error.message || "Failed to delete category");
//     },
//   });

//   return (
//     <div>
//       <DataTable
//         data={data?.data ?? []}
//         columns={ideaCategoryColumns as ColumnDef<TIdea>[]}
//         loading={isLoading}
//         actions={{
//           onEdit: (doctor) => setEditingCategory(doctor),
//           onView: (doctor) => console.log(doctor),
//           onDelete: (doctor) => handleDelete(doctor.id), // ✅ সরাসরি id পাঠাও
//         }}
//         emptyMessage="No Category found"
  
//         toolbarAction={<AddCategoryModal />}
//       />

//       {editingCategory && (
//         <EditCategoryModal
//           doctor={editingCategory}
//           open={!!editingCategory}
//           onClose={() => setEditingCategory(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default CategoryTable;



"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import DataTable from "@/components/common/table/dataTable";
import { toast } from "sonner";
import {
  deleteCategory,
  getAllCategory,
} from "@/service/idea.catetogory.service";
import { TIdeaCategory } from "@/types/idea.category.type";
import { ideaCategoryColumns } from "./categoryColumn";
import AddCategoryModal from "./addCategoryModal";
import EditCategoryModal from "./editCategoryModal";

const CategoryTable = () => {
  const queryClient = useQueryClient();

  // ✅ FETCH ALL CATEGORY
  const { data, isLoading } = useQuery({
    queryKey: ["category"], // ✅ KEEP CONSISTENT
    queryFn: getAllCategory,
  });

  const [editingCategory, setEditingCategory] =
    useState<TIdeaCategory | null>(null);

  // ✅ DELETE
  const { mutate: handleDelete } = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      toast.success("Category deleted successfully");

      // ✅ IMPORTANT: same key use
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete category");
    },
  });

  return (
    <div>
      <DataTable
        data={data?.data ?? []}
        columns={ideaCategoryColumns}
        loading={isLoading}
        actions={{
          onEdit: (category) => setEditingCategory(category),
          onDelete: (category) => handleDelete(category?.id as string),
        }}
        emptyMessage="No Category found"
        toolbarAction={<AddCategoryModal />}
      />

      {/* ✅ EDIT MODAL */}
      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          open={!!editingCategory}
          onClose={() => setEditingCategory(null)}
        />
      )}
    </div>
  );
};

export default CategoryTable;