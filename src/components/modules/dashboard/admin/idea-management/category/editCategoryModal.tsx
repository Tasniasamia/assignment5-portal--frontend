// editCategoryModal.tsx
"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { TIdeaCategory } from "./categoryColumn";
import { getCategoryById, updateCategory } from "@/service/idea.catetogory.service";
import AppField from "@/components/common/form/AppField";

interface IEditCategoryModalProps {
  category: TIdeaCategory;
  open: boolean;
  onClose: () => void;
}

export default function EditCategoryModal({
  category,
  open,
  onClose,
}: IEditCategoryModalProps) {
  const queryClient = useQueryClient();

  const { data: categoryData, isLoading } = useQuery({
    queryKey: ["category", category?.id],
    queryFn: () => getCategoryById(category?.id),
    enabled: open && !!category?.id,
  });

  const currentCategory:any = categoryData?.data ?? category;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateCategory,
  });

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await mutateAsync({
          id: category?.id,
          payload: { name: value.name, description: value.description },
        });

        if (!res.success) {
          console.log("Update failed:", res);
          toast.error(res.message || "Update failed");
          return;
        }

        toast.success("Category updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["category"] });
        onClose(); // ✅ success এ modal বন্ধ
      } catch (error: any) {
        toast.error(error?.message || "Something went wrong");
      }
    },
  });

  useEffect(() => {
    if (currentCategory) {
      form.reset({
        name: currentCategory.name ?? "",
        description: currentCategory.description ?? "",
      });
    }
  }, [currentCategory]);

  return (
    <Dialog open={open} onOpenChange={onClose} >
      <DialogContent className="sm:max-w-lg w-full rounded-xl !bg-white">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="text-lg font-semibold">
            Edit Category
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-5 pt-2 "
          >
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) =>
                  !value ? "Name is required" : undefined,
              }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Category Name"
                  placeholder="Enter category name"
                />
              )}
            </form.Field>

            <form.Field
              name="description"
              validators={{
                onChange: ({ value }) =>
                  !value ? "Description is required" : undefined,
              }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Description"
                  placeholder="Enter description"
                />
              )}
            </form.Field>

            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="outline" disabled={isPending}>
                {isPending && (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}