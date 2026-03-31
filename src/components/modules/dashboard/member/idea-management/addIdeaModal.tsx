"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import AppField from "@/components/common/form/AppField";
import ImageUpload from "@/components/common/form/imageUploadForm";
import { toast } from "sonner";
import { createIdea } from "@/service/idea.service";
import { getAllCategory } from "@/service/idea.catetogory.service";
import AppSelect from "@/components/common/form/AppSelect";

export default function AddIdeaModal() {
  const [open, setOpen] = useState(false);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [uploadKey, setUploadKey] = useState(0);
  const [ideaType, setIdeaType] = useState<"FREE" | "PAID">("FREE");
  const queryClient = useQueryClient();

  // ✅ fetch categories
  const { data: categoryData } = useQuery({
    queryKey: ["category"],
    queryFn: getAllCategory,
    enabled: open,
  });
  const categories = categoryData?.data ?? [];

  const form = useForm({
    defaultValues: {
      title: "",
      problemStatement: "",
      proposedSolution: "",
      description: "",
      categoryId: "",
      price: "",
       isPublished: false,
    },
    onSubmit: async ({ value }) => {
      if (newFiles.length === 0) {
        toast.error("Please upload at least one image");
        return;
      }

      const formData = new FormData();

      const data = {
        title: value.title,
        problemStatement: value.problemStatement,
        proposedSolution: value.proposedSolution,
        description: value.description,
        categoryId: value.categoryId,
        type: ideaType,
        isPublished: value.isPublished,
        
        ...(ideaType === "PAID" && { price: Number(value.price) }),
      };

      formData.append("data", JSON.stringify(data));
      newFiles.forEach((file) => formData.append("images", file));

      handleCreate(formData);
    },
  });

  const { mutate: handleCreate, isPending } = useMutation({
    mutationFn: createIdea,
    onSuccess: () => {
      toast.success("Idea created successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-ideas"] });
      setOpen(false);
      form.reset();
      setNewFiles([]);
      setUploadKey((prev) => prev + 1);
      setIdeaType("FREE");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create idea");
    },
  });
const categoryOptions = categories.map((c: { id: string; name: string }) => ({
  label: c.name,
  value: c.id,
}));
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex cursor-pointer items-center gap-2 rounded-md text-sm font-medium bg-primary bg-white hover:bg-primary/90 h-9 px-4">
        <Plus className="h-4 w-4" />
        Add Idea
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl bg-white">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="text-lg font-semibold">Add New Idea</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4 pt-2"
        >
          {/* Title */}
          <form.Field
            name="title"
            validators={{ onChange: ({ value }) => !value ? "Title is required" : undefined }}
          >
            {(field) => (
              <AppField field={field} label="Title" placeholder="Enter idea title" />
            )}
          </form.Field>

          {/* Category + Type */}
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
//                  required
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

          {/* Price — only if PAID */}
          {ideaType === "PAID" && (
            <form.Field
              name="price"
              validators={{ onChange: ({ value }) => !value ? "Price is required" : undefined }}
            >
              {(field) => (
                <AppField field={field} label="Price ($)" type="number" placeholder="Enter price" />
              )}
            </form.Field>
          )}

          {/* Problem Statement */}
          <form.Field
            name="problemStatement"
            validators={{ onChange: ({ value }) => !value ? "Problem statement is required" : undefined }}
          >
            {(field) => (
              <AppField field={field} label="Problem Statement" placeholder="Describe the problem" />
            )}
          </form.Field>

          {/* Proposed Solution */}
          <form.Field
            name="proposedSolution"
            validators={{ onChange: ({ value }) => !value ? "Proposed solution is required" : undefined }}
          >
            {(field) => (
              <AppField field={field} label="Proposed Solution" placeholder="Describe the solution" />
            )}
          </form.Field>

          {/* Description */}
          <form.Field
            name="description"
            validators={{ onChange: ({ value }) => !value ? "Description is required" : undefined }}
          >
            {(field) => (
              <AppField field={field} label="Description" placeholder="Enter full description" />
            )}
          </form.Field>

          {/* Image Upload */}
          <div className="space-y-1.5">
            <Label>Images <span className="text-red-500">*</span></Label>
            <ImageUpload
              key={uploadKey}
              multiple={true}
              existingUrls={[]}
              onChange={(files) => setNewFiles(files)}
              // onDeleteExisting={() => {}}
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="outline" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Create Idea
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}