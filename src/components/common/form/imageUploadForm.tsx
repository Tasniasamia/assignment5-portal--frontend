// "use client";

// import { useRef, useState } from "react";

// interface ImageUploadProps {
//   multiple?: boolean;
//   existingUrls?: string[];
//   onChange?: (files: File[]) => void;
//   onDeleteExisting?: (url: string) => Promise<void>; // delete API
// }

// export default function ImageUpload({
//   multiple = false,
//   existingUrls = [],
//   onChange,
//   onDeleteExisting,
// }: ImageUploadProps) {
//   const fileRef = useRef<HTMLInputElement>(null);

//   const [existing, setExisting] = useState<string[]>(existingUrls);
//   const [files, setFiles] = useState<File[]>([]);
//   const [previews, setPreviews] = useState<string[]>([]);

//   // 📌 file select
// //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const selected = Array.from(e.target.files || []);

// //     const newPreviews = selected.map((f) => URL.createObjectURL(f));

// //     setFiles((prev) => {
// //       const updated = multiple ? [...prev, ...selected] : selected;
// //       onChange?.(updated);
// //       return updated;
// //     });

// //     setPreviews((prev) =>
// //       multiple ? [...prev, ...newPreviews] : newPreviews
// //     );
// //   };
// const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   const selected = Array.from(e.target.files || []);

//   const newPreviews = selected.map((f) => URL.createObjectURL(f));

//   let updatedFiles: File[];

//   if (multiple) {
//     updatedFiles = [...files, ...selected];
//   } else {
//     updatedFiles = selected;
//   }

//   setFiles(updatedFiles);
//   setPreviews(multiple ? [...previews, ...newPreviews] : newPreviews);

//   // ✅ SAFE জায়গা
//   onChange?.(updatedFiles);
// };
//   // 📌 delete existing image
//   const handleDeleteExisting = async (url: string) => {
//     if (onDeleteExisting) {
//       await onDeleteExisting(url); // 🔥 API call
//     }
//     setExisting((prev) => prev.filter((i) => i !== url));
//   };

//   // 📌 delete new file
//   const handleDeleteNew = (index: number) => {
//     setFiles((prev) => {
//       const updated = prev.filter((_, i) => i !== index);
//       onChange?.(updated);
//       return updated;
//     });

//     setPreviews((prev) => prev.filter((_, i) => i !== index));
//   };

//   return (
//     <div>
//       <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//         {/* existing images */}
//         {existing.map((url, i) => (
//           <div key={i}>
//             <img src={url} width={80} />
//             <button onClick={() => handleDeleteExisting(url)}>
//               Delete
//             </button>
//           </div>
//         ))}

//         {/* new images */}
//         {previews.map((url, i) => (
//           <div key={i}>
//             <img src={url} width={80} />
//             <button onClick={() => handleDeleteNew(i)}>
//               Remove
//             </button>
//           </div>
//         ))}

//         {/* upload button */}
//         <div onClick={() => fileRef.current?.click()}>
//           Upload
//         </div>
//       </div>

//       <input
//         ref={fileRef}
//         type="file"
//         hidden
//         multiple={multiple}
//         onChange={handleChange}
//       />
//     </div>
//   );
// }

















// "use client";

// import { useEffect, useRef, useState } from "react";

// interface ImageUploadProps {
//   multiple?: boolean;
//   existingUrls?: string[];
//   onChange?: (files: File[]) => void;
//   onDeleteExisting?: (url: string) => Promise<void>;
// }

// export default function ImageUpload({
//   multiple = false,
//   existingUrls = [],
//   onChange,
//   onDeleteExisting,
// }: ImageUploadProps) {
//   const fileRef = useRef<HTMLInputElement>(null);

//   const [existing, setExisting] = useState<string[]>(existingUrls);
//   const [files, setFiles] = useState<File[]>([]);
//   const [previews, setPreviews] = useState<string[]>([]);
//   const [isDragging, setIsDragging] = useState(false);

//   // 📌 file select
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selected = Array.from(e.target.files || []);
//     const newPreviews = selected.map((f) => URL.createObjectURL(f));

//     let updatedFiles: File[];
//     if (multiple) {
//       updatedFiles = [...files, ...selected];
//     } else {
//       updatedFiles = selected;
//     }

//     setFiles(updatedFiles);
//     setPreviews(multiple ? [...previews, ...newPreviews] : newPreviews);
//     onChange?.(updatedFiles);
//   };

//   // drag-and-drop
//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(false);
//     const dropped = Array.from(e.dataTransfer.files).filter((f) =>
//       f.type.startsWith("image/")
//     );
//     if (!dropped.length) return;

//     const newPreviews = dropped.map((f) => URL.createObjectURL(f));
//     const updatedFiles = multiple ? [...files, ...dropped] : dropped;

//     setFiles(updatedFiles);
//     setPreviews(multiple ? [...previews, ...newPreviews] : newPreviews);
//     onChange?.(updatedFiles);
//   };

//   // 📌 delete existing image
//   const handleDeleteExisting = async (url: string) => {
//     if (onDeleteExisting) {
//       await onDeleteExisting(url);
//     }
//     setExisting((prev) => prev.filter((i) => i !== url));
//   };

//   // 📌 delete new file
//   const handleDeleteNew = (index: number) => {
//     setFiles((prev) => {
//       const updated = prev.filter((_, i) => i !== index);
//       onChange?.(updated);
//       return updated;
//     });
//     setPreviews((prev) => prev.filter((_, i) => i !== index));
//   };
// // 🔥 Only state update


// // 🔥 Only state update
// // const handleDeleteNew = (index: number) => {
// //   setFiles((prev) => prev.filter((_, i) => i !== index));
// // };

// // 🔥 ONE place to notify parent
// // useEffect(() => {
// //   onChange?.(files);
// // }, [files]);
//   const totalImages = existing.length + previews.length;

//   return (
//     <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 max-w-xl">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
//           Images
//         </span>
//         {totalImages > 0 && (
//           <span className="text-xs font-medium text-gray-400 bg-gray-100 border border-gray-200 px-3 py-0.5 rounded-full">
//             {totalImages} added
//           </span>
//         )}
//       </div>

//       {/* Grid */}
//       <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
//         {/* Existing images */}
//         {existing.map((url, i) => (
//           <div
//             key={`existing-${i}`}
//             className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
//           >
//             <img
//               src={url}
//               alt={`existing-${i}`}
//               className="w-full h-full object-cover"
//             />

//             {/* Badge */}
//             <span className="absolute top-1.5 left-1.5 text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-violet-100 text-violet-600 border border-violet-200">
//               Saved
//             </span>

//             {/* Hover overlay */}
//             <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//               <button
//                 onClick={() => handleDeleteExisting(url)}
//                 className="w-8 h-8 rounded-full border border-red-400 bg-red-50/20 text-red-300 flex items-center justify-center text-xl leading-none hover:bg-red-500 hover:text-white hover:scale-110 transition-all"
//               >
//                 ×
//               </button>
//             </div>
//           </div>
//         ))}

//         {/* New preview images */}
//         {previews.map((url, i) => (
//           <div
//             key={`new-${i}`}
//             className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
//           >
//             <img
//               src={url}
//               alt={`preview-${i}`}
//               className="w-full h-full object-cover"
//             />

//             {/* Badge */}
//             <span className="absolute top-1.5 left-1.5 text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-600 border border-emerald-200">
//               New
//             </span>

//             {/* Hover overlay */}
//             <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//               <button
//                 onClick={() => handleDeleteNew(i)}
//                 className="w-8 h-8 rounded-full border border-red-400 bg-red-50/20 text-red-300 flex items-center justify-center text-xl leading-none hover:bg-red-500 hover:text-white hover:scale-110 transition-all"
//               >
//                 ×
//               </button>
//             </div>
//           </div>
//         ))}

//         {/* Upload dropzone */}
//         {(multiple || totalImages === 0) && (
//           <div
//             onClick={() => fileRef.current?.click()}
//             onDragOver={(e) => {
//               e.preventDefault();
//               setIsDragging(true);
//             }}
//             onDragLeave={() => setIsDragging(false)}
//             onDrop={handleDrop}
//             className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all select-none ${
//               isDragging
//                 ? "border-violet-500 bg-violet-50 text-violet-500"
//                 : "border-gray-300 bg-gray-50 text-gray-400 hover:border-violet-400 hover:bg-violet-50 hover:text-violet-500"
//             }`}
//           >
//             <div
//               className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all ${
//                 isDragging ? "bg-violet-100 scale-110" : "bg-gray-100"
//               }`}
//             >
//               ↑
//             </div>
//             <span className="text-[11px] font-medium text-center leading-tight">
//               {isDragging ? "Drop here" : "Upload"}
//             </span>
//           </div>
//         )}
//       </div>

//       <input
//         ref={fileRef}
//         type="file"
//         hidden
//         accept="image/*"
//         multiple={multiple}
//         onChange={handleChange}
//       />
//     </div>
//   );
// }






























"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  multiple?: boolean;
  existingUrls?: string[];
  onChange?: (files: File[]) => void;
  onDeleteExisting?: (url: string) => Promise<void>;
  maxSizeMB?: number;
}

export default function ImageUpload({
  multiple = false,
  existingUrls = [],
  onChange,
  onDeleteExisting,
  maxSizeMB = 2,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existing, setExisting] = useState<string[]>(existingUrls);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  // 🔥 sync existing (important)
  useEffect(() => {
    setExisting(existingUrls);
  }, [existingUrls]);

  // 🔥 notify parent safely
  useEffect(() => {
    onChange?.([...files]);
  }, [files]);

  // ─────────────────────────────
  // 📌 validation
  // ─────────────────────────────
  const validateFiles = (selected: File[]) => {
    for (let file of selected) {
      if (!file.type.startsWith("image/")) {
        return "Only image files allowed";
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        return `Max file size ${maxSizeMB}MB`;
      }
    }
    return null;
  };

  // ─────────────────────────────
  // 📌 handle files
  // ─────────────────────────────
  const handleFiles = (selected: File[]) => {
    const err = validateFiles(selected);
    if (err) {
      setError(err);
      return;
    }

    setError("");

    const newPreviews = selected.map((f) => URL.createObjectURL(f));

    if (multiple) {
      setFiles((prev) => [...prev, ...selected]);
      setPreviews((prev) => [...prev, ...newPreviews]);
    } else {
      setFiles(selected);
      setPreviews(newPreviews);
    }
  };

  // ─────────────────────────────
  // 📌 input change
  // ─────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    handleFiles(selected);
  };

  // ─────────────────────────────
  // 📌 drag drop
  // ─────────────────────────────
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  // ─────────────────────────────
  // 📌 delete new
  // ─────────────────────────────
  const removeNew = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ─────────────────────────────
  // 📌 delete existing
  // ─────────────────────────────
  const removeExisting = async (url: string) => {
    if (onDeleteExisting) {
      await onDeleteExisting(url);
    }
    setExisting((prev) => prev.filter((i) => i !== url));
  };

  return (
    <div className="space-y-3">
      {/* 🔥 Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <p className="text-sm text-gray-600">
          Drag & drop image here or click to upload
        </p>
      </div>

      <input
        ref={fileRef}
        type="file"
        hidden
        multiple={multiple}
        accept="image/*"
        onChange={handleChange}
      />

      {/* ❌ Error */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* 🖼️ Existing Images */}
      <div className="flex gap-2 flex-wrap">
        {existing.map((url, i) => (
          <div key={i} className="relative">
            <img src={url} className="w-20 h-20 object-cover rounded" />
            <button type="button"
              onClick={() => removeExisting(url)}
              className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
            >
              ✕
            </button>
          </div>
        ))}

        {/* 🆕 New Images */}
        {previews.map((url, i) => (
          <div key={i} className="relative">
            <img src={url} className="w-16 h-16 object-cover rounded" />
            <button type="button"
              onClick={() => removeNew(i)}
              className="absolute top-0 right-0 bg-black text-white text-xs px-1 rounded"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}