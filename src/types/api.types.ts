import { authValidationSchema } from "@/zod/auth.validation"
import z from "zod"

export interface ApiResponse<TData>{
    success:boolean,
    message:string,
    data:TData,
    meta?:PaginationMeta
}

export interface PaginationMeta{
    page:number,
    total:number,
    totalPages:number,
    limit:number
}

export interface ApiErrorResponse{
    success:boolean,
    message:string
}

