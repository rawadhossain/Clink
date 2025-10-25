// Handle access by others who have the shared link (view/edit anonymously).

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET /api/note/shared/[token] - fetch the note by shareToken
export async function GET(request: Request, { params }: { params: { token: string } }) {
	try {
		const { token } = await params;

		// Find the note with this share token
		const note = await prisma.note.findUnique({
			where: { shareToken: token },
			select: {
				id: true,
				title: true,
				content: true,
				shareMode: true,
				updatedAt: true,
			},
		});

		if (!note) {
			return NextResponse.json({ error: "Invalid or expired share link" }, { status: 404 });
		}

		return NextResponse.json({
			note,
			canEdit: note.shareMode === "EDIT",
		});
	} catch (error) {
		console.error("Error fetching shared note:", error);
		return NextResponse.json({ error: "Failed to fetch shared note" }, { status: 500 });
	}
}

// PUT /api/note/shared/[token] - edit note only if shareMode === EDIT
export async function PUT(req: NextRequest, { params }: { params: { token: string } }) {
	try {
		const { token } = await params;
		const { title, content } = await req.json();

		// 1. Find the note via token
		const note = await prisma.note.findUnique({
			where: { shareToken: token },
			select: {
				id: true,
				shareMode: true,
			},
		});

		if (!note) {
			return NextResponse.json({ error: "Invalid or expired share link" }, { status: 404 });
		}

		// 2. Check permission
		if (note.shareMode !== "EDIT") {
			return NextResponse.json(
				{ error: "Editing not allowed for this shared note" },
				{ status: 403 }
			);
		}

		// 3. Update the note - confirmed that shareMode == EDIT
		const updated = await prisma.note.update({
			where: { id: note.id },
			data: {
				title,
				content,
				updatedAt: new Date(),
			},
			select: {
				id: true,
				title: true,
				content: true,
				updatedAt: true,
			},
		});

		return NextResponse.json({
			message: "Note updated successfully",
			note: updated,
		});
	} catch (error) {
		console.error("Error updating shared note:", error);
		return NextResponse.json({ error: "Failed to update shared note" }, { status: 500 });
	}
}
