import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare, hash } from "bcryptjs";
import { randomBytes } from "crypto";
import { z } from "zod";

import prisma from "./db";

const credentialsSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8, "Password must be at least 8 characters long"),
});

async function ensureOAuthUser(email: string, name?: string | null) {
	const existingUser = await prisma.user.findUnique({ where: { email } });

	if (existingUser) {
		if (name && existingUser.name !== name) {
			await prisma.user.update({
				where: { email },
				data: { name },
			});
		}

		return existingUser;
	}

	const randomPassword = randomBytes(32).toString("hex");
	const hashedPassword = await hash(randomPassword, 12);

	return prisma.user.create({
		data: {
			email,
			name,
			password: hashedPassword,
		},
	});
}

const providers = [
	CredentialsProvider({
		name: "Email",
		credentials: {
			email: { label: "Email", type: "email", placeholder: "you@example.com" },
			password: { label: "Password", type: "password", placeholder: "********" },
		},
		async authorize(credentials) {
			const parsedCredentials = credentialsSchema.safeParse(credentials);

			if (!parsedCredentials.success) {
				throw new Error("Invalid email or password");
			}

			const { email, password } = parsedCredentials.data;

			const user = await prisma.user.findUnique({ where: { email } });

			if (!user) {
				throw new Error("Invalid email or password");
			}

			const isValidPassword = await compare(password, user.password);

			if (!isValidPassword) {
				throw new Error("Invalid email or password");
			}

			return {
				id: user.id,
				email: user.email,
				name: user.name ?? undefined,
			};
		},
	}),
	...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
		? [
				GoogleProvider({
					clientId: process.env.GOOGLE_CLIENT_ID,
					clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				}),
			]
		: []),
] satisfies NextAuthOptions["providers"];

export const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/auth/signin",
	},
	providers,
	callbacks: {
		async signIn({ user, account }) {
			if (account?.provider === "google" && user?.email) {
				await ensureOAuthUser(user.email, user.name);
			}

			return true;
		},
		async jwt({ token, user }) {
			if (user) {
				token.sub = user.id;
				if (user.email) {
					token.email = user.email;
				}
				if (user.name) {
					token.name = user.name;
				}
			}

			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				if (token.sub) {
					session.user.id = token.sub;
				}
				if (token.email) {
					session.user.email = token.email as string;
				}
				if (token.name) {
					session.user.name = token.name as string;
				}
			}

			return session;
		},
	},
};
