"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import AppField from "@/components/common/form/AppField";
import ImageUpload from "@/components/common/form/imageUploadForm";
import { toast } from "sonner";
import { getIdeaById, updateIdea, TIdea } from "@/service/idea.service";
import { getAllCategory } from "@/service/idea.catetogory.service";
import AppSelect from "@/components/common/form/AppSelect";

interface EditIdeaModalProps {
  idea: TIdea;
  open: boolean;
  onClose: () => void;
}

export default function EditIdeaModal({ idea, open, onClose }: EditIdeaModalProps) {
  const queryClient = useQueryClient();
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [existingUrls, setExistingUrls] = useState<string[]>([]);
  const [ideaType, setIdeaType] = useState<"FREE" | "PAID">("FREE");
  const [uploadKey, setUploadKey] = useState(0);

  // ✅ fetch latest idea
  const { data: ideaData, isLoading } = useQuery({
    queryKey: ["admin-ideas", idea?.id],
    queryFn: () => getIdeaById(idea?.id),
    enabled: open && !!idea?.id,
  });
  const current = ideaData?.data ?? idea;
console.log("current idea data",current);
  // ✅ fetch categories
  const { data: categoryData } = useQuery({
    queryKey: ["category"],
    queryFn: getAllCategory,
    enabled: open,
  });
  const categories = categoryData?.data ?? [];

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateIdea,
  });

  const form = useForm({
    defaultValues: {
      title: "",
      problemStatement: "",
      proposedSolution: "",
      description: "",
      categoryId: "",
      price: "",
      isPublished: false
    },
    onSubmit: async ({ value }) => {
      try {
        const formData = new FormData();
        const data = {
          status:current.status,
          title: value.title,
          problemStatement: value.problemStatement,
          proposedSolution: value.proposedSolution,
          description: value.description,
          categoryId: value.categoryId,
          type: ideaType,
          existingImages: existingUrls, 
            isPublished: value.isPublished,
          ...(ideaType === "PAID" && { price: Number(value.price) }),
        };

        formData.append("data", JSON.stringify(data));
        newFiles.forEach((file) => formData.append("images", file));

        const res = await mutateAsync({ id: idea.id, formData });
        console.log("res", res);
        if (!res.success) {
          toast.error(res?.message || "Update failed");
          return;
        }
        toast.success(res?.message ?? "Idea updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["admin-ideas"] });
        queryClient.invalidateQueries({ queryKey: ["admin-ideas", idea.id] });
        onClose();
      } catch (error: any) {
        toast.error(error?.message || "Something went wrong");
      }
    },
  });

  // ✅ reset form with fetched data
// ✅ reset form with fetched data
useEffect(() => {
  if (current) {
    console.log("current in useEffect", current);
    form.setFieldValue("title", current.title ?? "");
    form.setFieldValue("problemStatement", current.problemStatement ?? "");
    form.setFieldValue("proposedSolution", current.proposedSolution ?? "");
    form.setFieldValue("description", current.description ?? "");
    form.setFieldValue("categoryId", current.categoryId ?? "");
    form.setFieldValue("price", current.price ? String(current.price) : "");
     form.setFieldValue("isPublished",current.isPublished);
    setIdeaType(current.type ?? "FREE");
    setExistingUrls(current.images ?? []);
  }
}, [current]);
const categoryOptions = categories.map((c: { id: string; name: string }) => ({
  label: c.name,
  value: c.id,
}));
console.log("categories",categories);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl bg-white">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="text-lg font-semibold">Edit Idea</DialogTitle>
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
            className="space-y-4 pt-2"
          >
            <form.Field name="title" validators={{ onChange: ({ value }) => !value ? "Required" : undefined }}>
              {(field) => <AppField field={field} label="Title"  />}
            </form.Field>

   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <form.Field
    name="categoryId"
    validators={{ onChange: ({ value }) => !value ? "Required" : undefined }}
  >
    {(field) => (
      <AppSelect
        label="Category"
        placeholder="Select category"
        options={categoryOptions}
        value={field.state.value}
                 onChange={(val) => field.handleChange(val ?? "")} // ✅
        required
        error={field.state.meta.errors?.[0]}
      />
    )}
  </form.Field>

  <AppSelect
    label="Type"
    options={[
      { label: "Free", value: "FREE" },
      { label: "Paid", value: "PAID" },
    ]}
    value={ideaType}
    onChange={(v) => setIdeaType(v as "FREE" | "PAID")}
  />
</div>

            {ideaType === "PAID" && (
              <form.Field name="price" validators={{ onChange: ({ value }) => !value ? "Required" : undefined }}>
                {(field) => <AppField field={field} label="Price ($)" type="number" placeholder="Enter price" />}
              </form.Field>
            )}

            <form.Field name="problemStatement" validators={{ onChange: ({ value }) => !value ? "Required" : undefined }}>
              {(field) => <AppField field={field} label="Problem Statement" placeholder="Describe the problem" />}
            </form.Field>

            <form.Field name="proposedSolution" validators={{ onChange: ({ value }) => !value ? "Required" : undefined }}>
              {(field) => <AppField field={field} label="Proposed Solution" placeholder="Describe the solution" />}
            </form.Field>

            <form.Field name="description" validators={{ onChange: ({ value }) => !value ? "Required" : undefined }}>
              {(field) => <AppField field={field} label="Description" placeholder="Enter full description" />}
            </form.Field>

            <div className="space-y-1.5">
              <Label>Images</Label>
              <ImageUpload
                key={uploadKey}
                multiple={true}
                existingUrls={existingUrls}
                onChange={(files) => setNewFiles(files)}
                // onDeleteExisting={(url) =>
                //   setExistingUrls((prev) => prev.filter((u) => u !== url))
                // }
              />
            </div>
<form.Field name="isPublished">
  {(field) => (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id="isPublished"
        checked={field.state.value}
       
        onChange={(e) => field.handleChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 accent-primary cursor-pointer"
      />
      <Label htmlFor="isPublished" className="cursor-pointer">
        Publish this idea
      </Label>
    </div>
  )}
</form.Field>
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" onClick={onClose} className="cursor-pointer">Cancel</Button>
              <Button type="submit" variant="outline" disabled={isPending} className="cursor-pointer">
                {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}