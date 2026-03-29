// "use client";
// import { useEffect, useState } from "react";
// import { updateProfileService } from "@/service/profile.service";
// import { deleteProfileImageService } from "@/service/profile.service";
// import ImageUpload from "@/components/common/form/imageUploadForm";

// interface UserProfile {
//   id: string;
//   name: string;
//   email: string;
//   image: string | null;
//   role: "ADMIN" | "MEMBER";
//   admin: { profilePhoto: string | null; contactNumber: string | null } | null;
//   member: { profilePhoto: string | null; contactNumber: string | null } | null;
// }

// export default function UpdateProfile({ data }: { data: any }) {
//   const [profile, setProfile] = useState<UserProfile | null>(null);

//   const [name, setName] = useState("");
//   const [contactNumber, setContactNumber] = useState("");

//   // 🔥 image state (simplified)
//   const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
//   const [newFile, setNewFile] = useState<File | null>(null);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // ─────────────────────────────────────────────
//   // ✅ Load user
//   // ─────────────────────────────────────────────
//   useEffect(() => {
//     try {
//       const u = data;

//       setProfile(u);
//       setName(u.name ?? "");

//       const roleData = u.role === "ADMIN" ? u.admin : u.member;
//       setContactNumber(roleData?.contactNumber ?? "");

//       const photo = roleData?.profilePhoto ?? u.image ?? null;
//       setExistingImageUrl(photo);
//     } catch {
//       setError("Failed to load profile.");
//     } finally {
//       setLoading(false);
//     }
//   }, [data]);

//   // ─────────────────────────────────────────────
//   // ✅ Submit
//   // ─────────────────────────────────────────────
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     setSaving(true);
//     setError("");
//     setSuccess("");

//     try {
//       const res = await updateProfileService({
//         name,
//         contactNumber,
//         file: newFile,
//       });

//       if (res.success) {
//         setSuccess("Profile updated successfully!");

//         // 🔥 update UI after upload
//         if (newFile) {
//           const preview = URL.createObjectURL(newFile);
//           setExistingImageUrl(preview);
//           setNewFile(null);
//         }

//         setTimeout(() => setSuccess(""), 3000);
//       } else {
//         setError(res.message ?? "Update failed.");
//       }
//     } catch {
//       setError("Something went wrong.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ─────────────────────────────────────────────
//   // 🧠 Delete existing image (API call)
//   // ─────────────────────────────────────────────
//   const handleDeleteImage = async (url: string) => {
//     try {
//       await deleteProfileImageService(url); // 🔥 তোমার delete API
//       setExistingImageUrl(null);
//     } catch {
//       setError("Failed to delete image");
//     }
//   };

//   // ─────────────────────────────────────────────
//   // ⏳ Loading UI
//   // ─────────────────────────────────────────────
//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className="max-w-md mx-auto p-6 space-y-6 border rounded-xl">
//       <form onSubmit={handleSubmit} className="space-y-5">

//         {/* ───────── Image Upload ───────── */}
//         <div>
//           <label className="text-sm font-medium">Profile Photo</label>

//           <ImageUpload
//             multiple={false}
//             existingUrls={existingImageUrl ? [existingImageUrl] : []}
//             onChange={(files) =>{ files.length>0 && setNewFile(files[0] || null)}}
//             onDeleteExisting={handleDeleteImage}
//           />
   
//         </div>

//         {/* ───────── Email (readonly) ───────── */}
//         <div>
//           <label className="text-sm">Email</label>
//           <input
//             value={profile?.email}
//             disabled
//             className="w-full border p-2 rounded bg-gray-100"
//           />
//         </div>

//         {/* ───────── Name ───────── */}
//         <div>
//           <label className="text-sm">Full Name</label>
//           <input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full border p-2 rounded"
//           />
//         </div>

//         {/* ───────── Phone ───────── */}
//         <div>
//           <label className="text-sm">Contact Number</label>
//           <input
//             value={contactNumber}
//             onChange={(e) => setContactNumber(e.target.value)}
//             className="w-full border p-2 rounded"
//           />
//         </div>

//         {/* ───────── Alerts ───────── */}
//         {error && <p className="text-red-500 text-sm">{error}</p>}
//         {success && <p className="text-green-600 text-sm">{success}</p>}

//         {/* ───────── Submit ───────── */}
//         <button
//           type="submit"
//           disabled={saving}
//           className="w-full bg-blue-600 text-white py-2 rounded"
//         >
//           {saving ? "Saving..." : "Save Changes"}
//         </button>
//       </form>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import ImageUpload from "@/components/common/form/imageUploadForm";
import { updateProfileService, deleteProfileImageService } from "@/service/profile.service";

export default function UpdateProfile({ data }: { data: any }) {
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);

  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ─────────────────────────────
  // 🔥 Mutation (like login form)
  // ─────────────────────────────
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateProfileService,
  });

  // ─────────────────────────────
  // 🧠 Form Setup
  // ─────────────────────────────
  const form = useForm({
    defaultValues: {
      name: "",
      contactNumber: "",
    },

    onSubmit: async ({ value }) => {
      try {
        setServerError(null);
        setSuccess(null);
   console.log("payload: ",{
          ...value,
          file: newFile});
        const res = await mutateAsync({
          ...value,
          file: newFile, // 🔥 attach file এখানে
        });

        if (!res.success) {
          setServerError(res.message || "Update failed");
          return;
        }

        setSuccess("Profile updated successfully!");

        // 🔥 UI update
        if (newFile) {
          const preview = URL.createObjectURL(newFile);
          setExistingImageUrl(preview);
          setNewFile(null);
        }

      } catch (error: any) {
        setServerError(error?.message || "Something went wrong");
      }
    },
  });

  // ─────────────────────────────
  // 🔥 Load initial data
  // ─────────────────────────────
  useEffect(() => {
    if (!data) return;

    const roleData = data.role === "ADMIN" ? data.admin : data.member;

    form.setFieldValue("name", data.name ?? "");
    form.setFieldValue("contactNumber", roleData?.contactNumber ?? "");

    const photo = roleData?.profilePhoto ?? data.image ?? null;
    setExistingImageUrl(photo);
  }, [data]);

  // ─────────────────────────────
  // 🧠 Delete existing image
  // ─────────────────────────────
  const handleDeleteImage = async (url: string) => {
    try {
      await deleteProfileImageService(url);
      setExistingImageUrl(null);
    } catch {
      setServerError("Failed to delete image");
    }
  };

  // ─────────────────────────────
  // 🎯 UI
  // ─────────────────────────────
  return (
    <div className="max-w-md mx-auto p-6 space-y-6 border rounded-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-5"
      >
        {/* 🔥 Image Upload */}
        <div>
          <label className="text-sm font-medium">Profile Photo</label>

          <ImageUpload
            multiple={false}
            existingUrls={existingImageUrl ? [existingImageUrl] : []}
            onChange={(files) => {
              if (files.length === 0) setNewFile(null);
              else setNewFile(files[0]);
            }}
            onDeleteExisting={handleDeleteImage}
          />
        </div>

        {/* 🔥 Name */}
        <form.Field name="name">
          {(field) => (
            <div>
              <label className="text-sm">Full Name</label>
              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
          )}
        </form.Field>

        {/* 🔥 Contact */}
        <form.Field name="contactNumber">
          {(field) => (
            <div>
              <label className="text-sm">Contact Number</label>
              <input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
          )}
        </form.Field>

        {/* 🔥 Email (readonly) */}
        <div>
          <label className="text-sm">Email</label>
          <input
            value={data?.email}
            disabled
            className="w-full border p-2 rounded bg-gray-100"
          />
        </div>

        {/* 🔥 Alerts */}
        {serverError && (
          <p className="text-red-500 text-sm">{serverError}</p>
        )}
        {success && (
          <p className="text-green-600 text-sm">{success}</p>
        )}

        {/* 🔥 Submit */}
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting || isPending}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              {isSubmitting || isPending ? "Saving..." : "Save Changes"}
            </button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}