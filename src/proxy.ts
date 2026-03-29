import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/jwtUtils";
import { defaultRoute, isAuthRoute, routeOwner } from "./lib/auth.utils";
import { isWillExpiredSoon } from "./lib/token.utils";
import { getNewTokens, getUserInfoMiddleware } from "./service/auth.service";


const setTokenCookies = (response: NextResponse, tokenData: { accessToken: string; refreshToken: string; sessionToken: string }) => {
  response.cookies.set("accessToken", tokenData.accessToken, { httpOnly: true, path: "/", sameSite: "strict" });
  response.cookies.set("refreshToken", tokenData.refreshToken, { httpOnly: true, path: "/", sameSite: "strict" });
  response.cookies.set("better-auth.session_token", tokenData.sessionToken, { httpOnly: true, path: "/", sameSite: "strict" });
};

const buildResetPasswordURL = (baseUrl: string, email: string) => {
  const url = new URL('/reset-password', baseUrl);
  url.searchParams.set('email', email); // ✅ সবসময় email সহ redirect
  return url;
};

export const proxy = async (req: NextRequest) => {
  const { pathname } = req?.nextUrl;
  const accessToken = req.cookies.get('accessToken')?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  let userRole: string | undefined;
  const verifyAccessToken = await verifyToken(
    accessToken as string,
    process.env.ACCESS_TOKEN_SECRET as string
  );

  if (verifyAccessToken) {
    userRole = verifyAccessToken?.role === 'ADMIN' ? 'ADMIN' : verifyAccessToken?.role;
  }

  // ============================================
  // Rule-1: Logged in user → auth route এ গেলে dashboard এ
  // ============================================
  if ((await isAuthRoute(pathname)) && verifyAccessToken) {
      // verify-email বা reset-password এ থাকলে redirect করো না
  if (pathname === '/verify-email' || pathname === '/reset-password') {
    return NextResponse.next();
  }
    return NextResponse.redirect(new URL(defaultRoute(userRole as string), req.url));
  }

  // ============================================
  // Rule-2: /reset-password handling
  // ============================================
  if (pathname === '/reset-password') {
    const email = new URL(req.url).searchParams.get('email');

    if (!email) {
      // email নেই → login এ পাঠাও
      const loginURL = new URL('/login', req.url);
      loginURL.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginURL);
    }

    if (!accessToken) {
      return NextResponse.next(); // token নেই → reset page দেখাও
    }

    const user = await getUserInfoMiddleware(req);

  
    return NextResponse.redirect(new URL(defaultRoute(userRole as string), req.url));
  }

  // ============================================
  // Rule-3: Token expire হওয়ার আগে refresh
  // ============================================
  if (verifyAccessToken && refreshToken && isWillExpiredSoon(accessToken as string)) {
    try {
      const tokenData = await getNewTokens(refreshToken);

      if (tokenData) {
        const newReq = new NextRequest(req.url, {
          headers: new Headers({
            ...Object.fromEntries(req.headers),
            cookie: [
              `accessToken=${tokenData.accessToken}`,
              `refreshToken=${tokenData.refreshToken}`,
              `better-auth.session_token=${tokenData.sessionToken}`,
            ].join("; "),
          }),
        });

        const user = await getUserInfoMiddleware(newReq);
        let targetResponse: NextResponse;

        if (user?.emailVerified === false && pathname !== '/verify-email') {
          const verifyEmailUrl = new URL("/verify-email", req.url);
          verifyEmailUrl.searchParams.set("email", user?.email);
          targetResponse = NextResponse.redirect(verifyEmailUrl);
        }
        else if (user?.emailVerified && pathname === '/verify-email') {
          targetResponse = NextResponse.redirect(new URL(defaultRoute(userRole as string), req.url));
        }
        // else if (user?.needPasswordChanges && pathname !== '/reset-password') {
        //   // ✅ email সহ redirect
        //   targetResponse = NextResponse.redirect(buildResetPasswordURL(req.url, user.email));
        // }
        // else if (!user?.needPasswordChanges && pathname === '/reset-password') {
        //   targetResponse = NextResponse.redirect(new URL(defaultRoute(userRole as string), req.url));
        // }
        else {
          targetResponse = NextResponse.next({
            request: { headers: new Headers(req.headers) }
          });
        }

        setTokenCookies(targetResponse, tokenData);
        return targetResponse;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  }

  // ============================================
  // Rule-4: Token আছে এবং valid
  // ============================================
  if (accessToken && verifyAccessToken && !isWillExpiredSoon(accessToken)) {
    const user = await getUserInfoMiddleware(req);

    if (user) {
      // console.log("user", user);

      if (user.emailVerified === false) {
        if (pathname !== "/verify-email") {
          const verifyEmailUrl = new URL("/verify-email", req.url);
          verifyEmailUrl.searchParams.set("email", user?.email);
          return NextResponse.redirect(verifyEmailUrl);
        }
        return NextResponse.next();
      }

      if (user.emailVerified && pathname === "/verify-email") {
        return NextResponse.redirect(new URL(defaultRoute(userRole as string), req.url));
      }

    }
  }

  // ============================================
  // Rule-5 & 6: Route owner check
  // ============================================
  const routeowner = await routeOwner(pathname as string);

  if (routeowner === null) {
    return NextResponse.next();
  }

  if (!accessToken) {
    const loginURL = new URL('/login', req.url);
    loginURL.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginURL);
  }

  if (routeowner === 'COMMON') {
    return NextResponse.next();
  }

  if (routeowner !== userRole) {
    return NextResponse.redirect(new URL(defaultRoute(userRole as string), req.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
};


