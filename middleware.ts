import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_ROUTES = ["/auth/signin"];
const PUBLIC_ROUTES = ["/", "/simple", "/notes/shared"];
const DEFAULT_REDIRECT = "/notes";

function matchesRoute(pathname: string, route: string) {
	if (route === "/") {
		return pathname === "/";
	}

	return pathname === route || pathname.startsWith(`${route}/`);
}

function isAuthRoute(pathname: string) {
	return AUTH_ROUTES.some((route) => matchesRoute(pathname, route));
}

function isPublicRoute(pathname: string) {
	return PUBLIC_ROUTES.some((route) => matchesRoute(pathname, route));
}

export async function middleware(request: NextRequest) {
	const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
	const { pathname, search } = request.nextUrl;

	if (isAuthRoute(pathname)) {
		if (token) {
			const callbackUrl = request.nextUrl.searchParams.get("callbackUrl") ?? DEFAULT_REDIRECT;
			return NextResponse.redirect(new URL(callbackUrl, request.url));
		}

		return NextResponse.next();
	}

	if (!token && !isPublicRoute(pathname)) {
		const signInUrl = new URL("/auth/signin", request.url);
		signInUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
		return NextResponse.redirect(signInUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
