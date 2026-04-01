"use server"
import { httpClient } from "@/lib/axios/httpClient";
import { TIdeaCategory } from "@/types/idea.category.type";

export const getAllCategory = async () => {
  try {
    const response = await httpClient.get<TIdeaCategory[]>(
       "/idea/category"
    );
    if (!response.success) throw new Error("Failed to fetch categories");
    return response;
  } catch (error) {
    console.error("Failed to fetch categories", error);
    throw error;
  }
};


// idea.catetogory.service.ts — getCategoryById fix
export const getCategoryById = async (id: string) => {
  try {
    const response = await httpClient.get<TIdeaCategory[]>(
      `/idea/category/${id}`  // ✅ slash ছিল না, এখন আছে
    );
    if (!response.success) throw new Error("Failed to fetch category");
    return response;
  } catch (error) {
    console.error("Failed to fetch category", error);
    throw error;
  }
};

// deleteCategory তেও একই bug ছিল:
export const deleteCategory = async (id: string) => {
  try {
    const response = await httpClient.delete<any>(`/idea/category/${id}`); // ✅
    if (!response.success) throw new Error("Failed to delete category");
    return response;
  } catch (error) {
    console.error("Failed to delete category", error);
    throw error;
  }
};


export const createCategory = async (payload: any) => {
  try {
    const response = await httpClient.post<any>("/idea/category", payload);
    if (!response.success) throw new Error("Failed to create category");
    return response;
  } catch (error) {
    console.error("Failed to create category", error);
    throw error;
  }
};


export const updateCategory = async ({ id, payload }: { id: string; payload: {name:string,description:string} }) => {
  try {
    const response = await httpClient.patch<any>(`/idea/category/${id}`, payload);
    if (!response.success) throw new Error("Failed to update category");
    return response;
  } catch (error) {
    console.error("Failed to update category", error);
    throw error;
  }
};