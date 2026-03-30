"use server";

import { httpClient } from "@/lib/axios/httpClient";

// ─────────────────────────────────────────────
// 🔹 Types
// ─────────────────────────────────────────────
interface UpdateProfilePayload {
  name?: string;
  contactNumber?: string;
  file?: File | null;        // single image
  files?: File[];            // future multiple support
}

// ─────────────────────────────────────────────
// ✅ Update Profile
// ─────────────────────────────────────────────
export const updateProfileService = async (
  payload: UpdateProfilePayload
) => {
  try {
    console.log("hit here",payload);
    const formData = new FormData();

    // 📌 JSON data
    const jsonData: Record<string, string> = {};

    if (payload.name) jsonData.name = payload.name;
    if (payload.contactNumber)
      jsonData.contactNumber = payload.contactNumber;

    formData.append("data", JSON.stringify(jsonData));

    // 📌 single image
    if (payload.file) {
      formData.append("file", payload.file);
    }

    // 📌 multiple images (future use)
    if (payload.files && payload.files.length > 0) {
      payload.files.forEach((file) => {
        formData.append("images", file); // backend অনুযায়ী key
      });
    }
console.log("formdata",formData);

    const response = await httpClient.patchForm<any>(
      "/auth/update-profile",
      formData
    );
//     if (response.success) {
//   revalidatePath("/my-profile"); // তোমার actual page path
// }
//  console.log("response",response)
    return response;
  } catch (error: any) {
    console.error("Update Profile Error:", error?.response?.data);
    throw error;
  }
};

// ─────────────────────────────────────────────
// 🧠 Delete Profile Image
// ─────────────────────────────────────────────
export const deleteProfileImageService = async (
  filePath: string
) => {
  try {
    console.log("filePath",filePath);
    // 🔥 JSON based delete (recommended)
    const response = await httpClient.post<any>("/auth/delete", {
      filePath
    });

    return response;
  } catch (error: any) {
    // console.error("Delete Image Error:", error?.response?.data);
    throw error;
  }
};