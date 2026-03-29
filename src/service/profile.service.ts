"use server"

import { httpClient } from "@/lib/axios/httpClient";


export const updateProfileService = async (payload: {
  name?: string;
  contactNumber?: string;
  file?: File | null;
}) => {
  const formData = new FormData();

  const jsonData: Record<string, string> = {};
  if (payload.name) jsonData.name = payload.name;
  if (payload.contactNumber) jsonData.contactNumber = payload.contactNumber;
  formData.append("data", JSON.stringify(jsonData));
  if (payload.file) {
    formData.append("file", payload.file);
  }
  const response = await httpClient.patchForm<any>(
      "/auth/update-profile",
      formData
    );
  console.log("response from updateProfileService", response);
  return response.data;
};

// ─── deleteProfileImage ───────────────────────────────────────────────────────
// Cloudinary থেকে image delete করার জন্য
// export const deleteProfileImageService = async (filePath: string) => {
//   const response = await axios.post(
//     `${API_BASE_URL}/delete`,
//     { filePath },
//     {
//       withCredentials: true,
//       headers: {
//         "Content-Type": "application/json",
//         ...getAuthHeader(),
//       },
//     }
//   );
//   return response.data;
// };