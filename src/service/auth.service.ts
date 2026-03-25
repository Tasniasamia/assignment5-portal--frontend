'use server'
import { verifyToken } from "@/lib/jwtUtils";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const getNewTokens = async (refreshToken: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/refresh-token`,
      {
        method: "GET",
        headers: { Cookie: `refreshToken=${refreshToken}` },
      }
    );

    if (!res.ok) return null;
    const responseData = await res.json();
    if (!responseData?.success) return null;

    const { accessToken, refreshToken: newRefreshToken, sessionToken } = responseData?.data;

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
    console.log("accessToken", accessToken);

    if (!accessToken) {
      return null;
    }

    // Optional: verify token on the frontend before calling backend
    const verified = await verifyToken(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    );
    if (!verified) {
      return null;
    }

    // Build a proper Cookie header from current cookies
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },
      }
    );
    // console.log("res", res);

    if (!res.ok) {
      console.error(
        "Failed to fetch user info:",
        res.status,
        res.statusText
      );
      return null;
    }

    const { data } = await res.json();
    // console.log("data", data);

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
      console.log("accessToken",accessToken);
      if (!accessToken) return null;
      // Token verify করুন আগে
      const verified = await verifyToken(
        accessToken, 
        process.env.ACCESS_TOKEN_SECRET as string
      );
      
      if (!verified) return null; // ← expired token দিয়ে call করবে না
      const allCookies = req.headers.get("cookie") || "";

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/me`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              Cookie: allCookies
          }
      });


      const {data}= await res.json();
      // console.log("data",data);
      return data;

  } catch (error) {
      console.error("Error fetching user info:", error);
      return null;
  }
}