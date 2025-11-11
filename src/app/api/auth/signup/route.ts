import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { hash } from "bcryptjs";
import { z } from "zod";

const signupSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters long"),
	name: z.string().min(1, "Name is required").optional(),
});

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const parsedCredentials = signupSchema.safeParse(body);

		if (!parsedCredentials.success) {
			return NextResponse.json(
				{
					error: "Invalid input",
					details: parsedCredentials.error.flatten().fieldErrors,
				},
				{ status: 400 }
			);
		}

		const { email, password, name } = parsedCredentials.data;

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return NextResponse.json(
				{ error: "User with this email already exists" },
				{ status: 409 }
			);
		}

		// Hash the password
		const hashedPassword = await hash(password, 12);

		// Create new user
		const newUser = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				name: name || null,
			},
		});

		// Return user without password
		const { password: _, ...userWithoutPassword } = newUser;

		return NextResponse.json(
			{
				message: "User created successfully",
				user: userWithoutPassword,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Signup error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
