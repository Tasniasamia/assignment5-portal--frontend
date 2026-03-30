export interface TIdeaCategory {
  id: string;
  name: string;
  description: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}