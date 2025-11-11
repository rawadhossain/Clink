"use client";

import type React from "react";
import type { Session } from "next-auth";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

interface ProvidersProps {
	children: React.ReactNode;
	session: Session | null;
}

export function Providers({ children, session }: ProvidersProps) {
	return (
		<SessionProvider session={session}>
			<ThemeProvider
				attribute="class"
				defaultTheme="dark"
				enableSystem
				disableTransitionOnChange
			>
				{children}
				<Toaster richColors position="top-center" />
			</ThemeProvider>
		</SessionProvider>
	);
}
