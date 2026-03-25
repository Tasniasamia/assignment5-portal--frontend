"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookie } from "@/lib/token.utils";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginPayloadType, ILoginResponse, IRegisterPayloadType, IRegisterResponse } from "@/types/auth.types";
import { authValidationSchema } from "@/zod/auth.validation";

export const createRegisterAction = async (payload: IRegisterPayloadType):Promise<IRegisterResponse|ApiErrorResponse> => {
  try {
    const parsePayload: any =
      authValidationSchema.registerSchema.safeParse(payload);
    if (!parsePayload) {
      return {
        success: false,
        message: `zod validation error. ${parsePayload?.error}`,
      };
    }
    const response = await httpClient.post<IRegisterResponse>(
      "/auth/register",
      payload
    );
    const { success , message, data } = await response.data;
    // console.log("responsedata",response?.data)
    
    return {...response};
  } catch (error: any) {
    // console.log("error:any",error?.message);
    return {
      success: false,
      message: `Login failed: ${error?.message}`,
    };
  }
};


