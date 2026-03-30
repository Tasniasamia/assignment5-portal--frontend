"use server";
import { httpClient } from "@/lib/axios/httpClient";
import { verifyToken } from "@/lib/jwtUtils";
import { ApiErrorResponse } from "@/types/api.types";
import {
  TResendOTPResponse,
  TVerifyEmailResponse,
  TVerifyResponse,
} from "@/types/auth.types";
import { authValidationSchema } from "@/zod/auth.validation";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const getNewTokens = async (refreshToken: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`,
      {
        method: "GET",
        headers: { Cookie: `refreshToken=${refreshToken}` },
      },
    );

    if (!res.ok) return null;
    const responseData = await res.json();
    if (!responseData?.success) return null;

    const {
      accessToken,
      refreshToken: newRefreshToken,
      sessionToken,
    } = responseData?.data;

    return { accessToken, refreshToken: newRefreshToken, sessionToken };
  } catch (error: unknown) {
    console.error("Error refreshing tokens:", error);
    return null;
  }
};

export async function getUserInfo() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    // console.log("accessToken", accessToken);

    if (!accessToken) {
      return null;
    }

    // Optional: verify token on the frontend before calling backend
    const verified = await verifyToken(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string,
    );
    if (!verified) {
      return null;
    }

    // Build a proper Cookie header from current cookies
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");
    const res: any = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`,
      {
        method: "GET",
        credentials: "include",
         cache:"no-store",// ✅ এটাই লাগবে — Next.js cache করবে না
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },
      },
    );
    
    // console.log("res", res);

    if (!res.ok) {
      console.error("Failed to fetch user info:", res.status, res.statusText);
      return null;
    }

    const { data } = await res.json();
    // console.log("getUserInfo data", data);

    return data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}
// auth.service.ts

export async function getUserInfoMiddleware(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;
    // console.log("accessToken",accessToken);
    if (!accessToken) return null;
    // Token verify করুন আগে
    const verified = await verifyToken(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string,
    );

    if (!verified) return null; // ← expired token দিয়ে call করবে না
    const allCookies = req.headers.get("cookie") || "";

    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/me`, {
    //     method: "GET",
    //     headers: {
    //         "Content-Type": "application/json",
    //         Cookie: allCookies
    //     }
    // });
    const res: any = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`,
      {
        method: "GET",
        credentials: "include",
        cache: "no-store", // ✅ এটাই লাগবে — Next.js cache করবে না
        headers: {
          "Content-Type": "application/json",
          Cookie: allCookies,
        },
      },
    );

    const { data } = await res.json();
    // console.log("data",data);
    return data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}

export const verifyOtpWithEmailAction = async (payload: {
  email: string;
  otp: string;
}): Promise<TVerifyResponse | ApiErrorResponse> => {
  try {
    const parsePayload: any =
      authValidationSchema.verifyEmailWithOtpSchema.safeParse(payload);
    if (!parsePayload) {
      return {
        success: false,
        message: `zod validation error. ${parsePayload?.error}`,
      };
    }
    const response = await httpClient.post<TVerifyResponse>(
      "/auth/verify-email",
      payload,
    );
    const { success, message, data } = await response.data;
    console.log("responsedata", response?.data);

    return { ...response };
  } catch (error: any) {
    return {
      success: false,
      message: `Email Verification Failed: ${error?.message}`,
    };
  }
};

export const resendOTP = async (payload: {
  email: string;
  type: string;
}): Promise<TResendOTPResponse | ApiErrorResponse> => {
  try {
    const parsePayload: any =
      authValidationSchema.resendOTPSchema.safeParse(payload);
    if (!parsePayload) {
      return {
        success: false,
        message: `zod validation error. ${parsePayload?.error}`,
      };
    }
    const response = await httpClient.post<TResendOTPResponse>(
      "/auth/resend-otp",
      payload,
    );
    console.log("response", response);
    const { success, message, data } = await response.data;
    console.log("responsedata", response?.data);

    return { ...response };
  } catch (error: any) {
    return {
      success: false,
      message: `Resend OTP failed: ${error?.message}`,
    };
  }
};

export const verifyEmail = async (payload: {
  email: string;
}): Promise<TVerifyEmailResponse | ApiErrorResponse> => {
  try {
    const parsePayload: any =
      authValidationSchema.verifyEmailSchema.safeParse(payload);
    if (!parsePayload) {
      return {
        success: false,
        message: `zod validation error. ${parsePayload?.error}`,
      };
    }
    const response = await httpClient.post<TResendOTPResponse>(
      "/auth/sendOtp",
      payload,
    );
    console.log("response", response);
    const { success, message, data } = await response.data;
    console.log("responsedata", response?.data);

    return { ...response };
  } catch (error: any) {
    return {
      success: false,
      message: `Verify Email failed: ${error?.message}`,
    };
  }
};

export const resetPassword = async (payload: {
  email: string;
  otp: string;
  password: string;
}): Promise<TVerifyEmailResponse | ApiErrorResponse> => {
  try {
    const parsePayload: any =
      authValidationSchema.resetPasswordSchema.safeParse(payload);
    if (!parsePayload) {
      return {
        success: false,
        message: `zod validation error. ${parsePayload?.error}`,
      };
    }
    const response = await httpClient.post<TResendOTPResponse>(
      "/auth/resetPassword",
      payload,
    );
    console.log("response", response);
    const response2 = await response.data;
    console.log("responsedata", response?.data);

    return { ...response };
  } catch (error: any) {
    return {
      success: false,
      message: `Reset Password failed: ${error?.message}`,
    };
  }
};


export const changePassword = async (payload: {
  newPassword: string;
  currentPassword: string;
}): Promise<TResendOTPResponse | ApiErrorResponse> => {
  try {
    const parsePayload: any =
      authValidationSchema.changePasswordSchema.safeParse(payload);
    if (!parsePayload) {
      return {
        success: false,
        message: `zod validation error. ${parsePayload?.error}`,
      };
    }
    const response = await httpClient.post<TResendOTPResponse>(
      "/auth/changePassword",
      payload,
    );
    console.log("response", response);
    const { success, message, data } = await response.data;
    console.log("responsedata", response?.data);

    return { ...response };
  } catch (error: any) {
    return {
      success: false,
      message: `Change Password failed: ${error?.message}`,
    };
  }
};


 

export const logOut = async () => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logOut`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
    }
  );

  const data = await response.json();

  if (data.success) {
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("better-auth.session_token");
  }

  return data;
};