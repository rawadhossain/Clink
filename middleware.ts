import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
	async function middleware(req) {
		const token = req.nextauth.token;
		const pathname = req.nextUrl.pathname;

		// Allow access to public routes
		if (pathname === "/" || pathname.startsWith("/api/auth")) {
			return NextResponse.next();
		}

		// If user is authenticated and tries to access auth pages, redirect to appropriate page
		if (pathname.startsWith("/auth") && token) {
			// if (!token.onboardingCompleted) {
			// 	return NextResponse.redirect(new URL("/onboarding", req.url));
			// }
			return NextResponse.redirect(new URL("/notes", req.url));
		}

		// If user is authenticated but hasn't completed onboarding
		// if (token && !token.onboardingCompleted && !pathname.startsWith("/onboarding")) {
		// 	return NextResponse.redirect(new URL("/onboarding", req.url));
		// }

		// If user has completed onboarding but tries to access onboarding page
		if (token) {
			return NextResponse.redirect(new URL("/notes", req.url));
		}

		return NextResponse.next();
	},
	{
		callbacks: {
			authorized: ({ token, req }) => {
				const pathname = req.nextUrl.pathname;

				// Allow access to public routes
				if (
					pathname === "/" ||
					pathname.startsWith("/auth") ||
					pathname.startsWith("/api/auth")
				) {
					return true;
				}

				// For all other routes, require authentication
				return !!token;
			},
		},
		pages: {
			signIn: "/auth/signin",
		},
	}
);

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
