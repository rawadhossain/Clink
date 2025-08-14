import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";

// PUT /api/note/[id] - Update a note
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
	const session = await getServerSession();

	if (!session?.user?.email) {
		return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
	}

	const userEmail = session.user?.email;

	try {
		const findUser = await prisma.user.findUnique({
			where: { email: userEmail },
		});

		if (!findUser) {
			return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
		}

		// Extract the note ID from the params
		const id = (await params).id;

		if (!id) {
			return NextResponse.json(
				{ success: false, error: "Invalid survey ID" },
				{ status: 400 }
			);
		}

		const body = await request.json();

		const { title, content } = body;

		if (!title || title.trim().length === 0 || !content) {
			return NextResponse.json(
				{ success: false, error: "Title and Content are required" },
				{ status: 400 }
			);
		}

		// Ensure the note belongs to the user
		const existingNote = await prisma.note.findUnique({
			where: { id },
		});

		if (!existingNote || existingNote.ownerId !== findUser.id) {
			return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
		}

		const note = await prisma.note.update({
			where: {
				id: id,
			},
			data: {
				title: title.trim(),
				content,
			},
		});

		return NextResponse.json({ success: true, data: note });
	} catch (error) {
		console.error("PUT /api/note/[id] error", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// DELETE /api/note/[id] - Delete a note
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
	const session = await getServerSession();

	if (!session?.user?.email) {
		return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
	}

	const userEmail = session?.user?.email;

	try {
		const findUser = await prisma.user.findUnique({
			where: { email: userEmail },
		});

		if (!findUser) {
			return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
		}

		// Extract the note ID from the params
		const id = (await params).id;

		if (!id) {
			return NextResponse.json(
				{ success: false, error: "Invalid survey ID" },
				{ status: 400 }
			);
		}

		// Ensure the note belongs to the user
		const existingNote = await prisma.note.findUnique({
			where: { id },
		});

		if (!existingNote || existingNote.ownerId !== findUser.id) {
			return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
		}

		const note = await prisma.note.delete({
			where: {
				id: id,
			},
		});

		return NextResponse.json({ success: true, data: note });
	} catch (error) {
		console.error("DELETE /api/note/[id] error", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}
