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
    queryKey: ["idea", idea?.id],
    queryFn: () => getIdeaById(idea?.id),
    enabled: open && !!idea?.id,
  });
  const current = ideaData?.data ?? idea;

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
    },
    onSubmit: async ({ value }) => {
      try {
        const formData = new FormData();
        const data = {
          title: value.title,
          problemStatement: value.problemStatement,
          proposedSolution: value.proposedSolution,
          description: value.description,
          categoryId: value.categoryId,
          type: ideaType,
          existingImages: existingUrls, // ✅ remaining existing images
          ...(ideaType === "PAID" && { price: Number(value.price) }),
        };
        formData.append("data", JSON.stringify(data));
        newFiles.forEach((file) => formData.append("images", file));

        const res = await mutateAsync({ id: idea.id, formData });
        if (!res.success) {
          toast.error(res.message || "Update failed");
          return;
        }
        toast.success("Idea updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["admin-ideas"] });
        queryClient.invalidateQueries({ queryKey: ["idea", idea.id] });
        onClose();
      } catch (error: any) {
        toast.error(error?.message || "Something went wrong");
      }
    },
  });

  // ✅ reset form with fetched data
  useEffect(() => {
    if (current) {
      form.reset({
        title: current.title ?? "",
        problemStatement: current.problemStatement ?? "",
        proposedSolution: current.proposedSolution ?? "",
        description: current.description ?? "",
        categoryId: current.categoryId ?? "",
        price: current.price ? String(current.price) : "",
      });
      setIdeaType(current.type ?? "FREE");
      setExistingUrls(current.images ?? []);
    }
  }, [current]);

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
              {(field) => <AppField field={field} label="Title" placeholder="Enter idea title" />}
            </form.Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <form.Field name="categoryId" validators={{ onChange: ({ value }) => !value ? "Required" : undefined }}>
                {(field) => (
                  <div className="space-y-1.5">
                    <Label>Category <span className="text-red-500">*</span></Label>
                    <Select value={field.state.value} onValueChange={field.handleChange}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {categories.map((c: any) => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </form.Field>

              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={ideaType} onValueChange={(v) => setIdeaType(v as any)}>
                  <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="FREE">Free</SelectItem>
                    <SelectItem value="PAID">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                onDeleteExisting={(url) =>
                  setExistingUrls((prev) => prev.filter((u) => u !== url))
                }
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isPending}>
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