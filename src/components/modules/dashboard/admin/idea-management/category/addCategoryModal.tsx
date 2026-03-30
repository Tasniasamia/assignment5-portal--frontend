// "use client";

// import { useForm } from "@tanstack/react-form";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { X, Plus, Loader2 } from "lucide-react";
// import AppField from "@/components/common/form/AppField";
// // import { createDoctor, getAllSpecialities } from "@/services/doctor.service";
// import { toast } from "sonner";
// import { createCategory } from "@/service/idea.catetogory.service";


// export default function AddCategoryModal() {
//   const [open, setOpen] = useState(false);
//   const queryClient = useQueryClient();

//   // ✅ specialities fetch




//   // ✅ create doctor mutation
//   const { mutate: handleCreate, isPending } = useMutation({
//     mutationFn: createCategory,
//     onSuccess: () => {
//       toast.success("Category created successfully");
//       queryClient.invalidateQueries({ queryKey: ["category"] });
//       setOpen(false);
//       form.reset();
//     },
//     onError: (error) => {
//       toast.error(error.message || "Failed to create doctor");
//     },
//   });

//   const form = useForm({
//     defaultValues: {
//       name: "",
//       description: ""
   
//     },
//     onSubmit: ({ value }) => {
      

//       const payload = {
//       name:value?.name,
//       description:value?.description
//       };
//     console.log("payload",payload);
//     if(payload){
//             handleCreate(payload);

//     }
//     },
//   });

//   return (
//     <Dialog className="mx-0" open={open} onOpenChange={setOpen}>
//  <DialogTrigger className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 transition-colors">
//   <Plus className="h-4 w-4" />
//   Add Category
// </DialogTrigger>

//       <DialogContent className=" !max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-lg">
//         <DialogHeader>
//           <DialogTitle>Add New Category</DialogTitle>
//         </DialogHeader>

//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             form.handleSubmit();
//           }}
//           className="space-y-4 mt-2 w-full"
//         >
    

//           <div className="grid grid-cols-2 gap-4">
//             {/* ✅ Name */}
//             <form.Field
//               name="name"
//               validators={{ onChange: ({ value }) => !value ? "Name is required" : undefined }}
//             >
//               {(field) => (
//                 <AppField field={field} label="Category Name" placeholder="Enter name" />
//               )}
//             </form.Field>

//             {/* ✅ description */}
//             <form.Field
//               name="description"
//               validators={{ onChange: ({ value }) => !value ? "description is required" : undefined }}
//             >
//               {(field) => (
//                 <AppField field={field} label="Description" type="text" placeholder="Enter description" />
//               )}
//             </form.Field>

            

//           {/* ✅ Submit */}
//           <div className="flex justify-end gap-2 pt-2">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" disabled={isPending}>
//               {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
//               Create Category
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import AppField from "@/components/common/form/AppField";
import { toast } from "sonner";
import { createCategory } from "@/service/idea.catetogory.service";

export default function AddCategoryModal() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
    onSubmit: ({ value }) => {
      handleCreate({
        name: value.name,
        description: value.description,
      });
    },
  });

  // ✅ mutation
  const { mutate: handleCreate, isPending } = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success("Category created successfully");

      queryClient.invalidateQueries({ queryKey: ["category"] }); // ✅ FIX

      setOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create category"); // ✅ FIX
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex cursor-pointer items-center gap-2 rounded-md text-sm font-medium bg-white text-primary-foreground  hover:bg-primary h-9 px-4">
        <Plus className="h-4 w-4" />
        Add Category
      </DialogTrigger>

      <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto !bg-white">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4 mt-2"
        >
          {/* ✅ FIXED GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  placeholder="Enter name"
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
          </div>

          {/* ✅ ACTION BUTTON (OUTSIDE GRID) */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" variant="outline" disabled={isPending}>
              {isPending && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              Create Category
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}