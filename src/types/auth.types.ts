import { authValidationSchema } from "@/zod/auth.validation";
import z from "zod";

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  token: string;
  user: user;
}
export interface user {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined | undefined;
  role: string;
  status: string;
  needPasswordChanges: boolean;
  isDeleted: boolean;
  deletedAt?: Date | null | undefined;
}
export type ILoginPayloadType=z.infer<typeof authValidationSchema.loginSchema>



export interface IPatient {
    id: string;
    userId: string;
  
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
  
    role: string;
    status:string;
  
    needPasswordChanges: boolean;
    isDeleted: boolean;
    deletedAt: string | null;
  
    profilePhoto: string | null;
    contactNumber: string | null;
    address: string | null;
  
    createdAt: string;  
    updatedAt: string; 
  }
  export interface IRegisterResponse {
    success: boolean;
    message: string;
    data: IPatient;
  }

  export type IRegisterPayloadType=z.infer<typeof authValidationSchema.registerSchema>
