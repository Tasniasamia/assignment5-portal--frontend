"use server";

import { defaultRoute, isValidRedirect } from "@/lib/auth.utils";
import { httpClient } from "@/lib/axios/httpClient";
import { setTokenInCookie } from "@/lib/token.utils";
import { ApiErrorResponse } from "@/types/api.types";
import { ILoginPayloadType, ILoginResponse } from "@/types/auth.types";
import { authValidationSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const createLoginAction = async (payload: ILoginPayloadType,redirectURL:string):Promise<ILoginResponse|ApiErrorResponse> => {
  try {
    const parsePayload: any =
      authValidationSchema.loginSchema.safeParse(payload);
    if (!parsePayload) {
      return {
        success: false,
        message: `zod validation error. ${parsePayload?.error}`,
      };
    }
    const response = await httpClient.post<ILoginResponse>(
      "/auth/login",
      payload
    );
    // console.log("response data",response);
    const { accessToken, refreshToken, token ,user} = await response.data;
    // console.log("response",response?.data);
    await setTokenInCookie("accessToken", accessToken,(process?.env.ACCESS_TOKEN_SECRET as string));
    await setTokenInCookie("refreshToken", refreshToken,(process?.env.REFRESH_TOKEN_SECRET as string));
    await setTokenInCookie("better-auth.session_token", token);
    // if(!user?.emailVerified && user?.needPasswordChanges){
    //   redirect(`/verify-email?email=${user?.email}`);

    // }
    if (!user?.emailVerified) {
      redirect(`/verify-email?email=${user?.email}`);
      // needPasswordChanges থাকলেও এখানে আসবে না
    }
            
        if(user?.needPasswordChanges){

          redirect(`/reset-password?email=${user?.email}`);
      }
    if (redirectURL && isValidRedirect(redirectURL, user.role)) {
      redirect(redirectURL);
    }

    redirect(defaultRoute(user.role));

  } catch (error: any) {

    if (error?.digest?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    if (error && error.response && error.response.data.message === "Email not verified") {
      redirect(`/verify-email?email=${payload.email}`);
  }
    return {
      success: false,
      message: `Login failed: ${error?.message}`,
    };
  }
};


