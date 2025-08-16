import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";

// POST /api/note - Create a new note
export async function POST(req: NextRequest) {
	const session = await getServerSession();

	if (!session) {
		return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
	}

	const userEmail = session.user?.email;
	if (!userEmail) {
		return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await req.json();

		if (!body.title || body.title.trim().length === 0 || !body.content) {
			return NextResponse.json(
				{ success: false, error: "Title and Content are required" },
				{ status: 400 }
			);
		}

		const findUser = await prisma.user.findUnique({
			where: { email: userEmail },
		});

		if (!findUser) {
			return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
		}

		const note = await prisma.note.create({
			data: {
				title: body.title.trim(),
				content: body.content,
				ownerId: findUser.id,
			},
		});

		return NextResponse.json({ success: true, data: note }, { status: 201 });
	} catch (error) {
		console.error("POST /api/note error", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// GET /api/note - Get all notes for the authenticated user
export async function GET(req: NextRequest) {
	const session = await getServerSession();

	if (!session?.user?.email) {
		console.log("Unauthorized session");

		return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
	}

	const userEmail = session.user?.email;

	try {
		const findUser = await prisma.user.findUnique({
			where: { email: userEmail },
		});

		if (!findUser) {
			console.log("User not found");

			return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
		}

		// Get all notes for the authenticated user
		const notes = await prisma.note.findMany({
			where: { ownerId: findUser.id },
			select: { id: true, title: true, content: true, updatedAt: true },
			orderBy: { updatedAt: "desc" },
		});

		return NextResponse.json({ success: true, data: notes });
	} catch (error) {
		console.error("GET /api/note error", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}
