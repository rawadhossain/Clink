// Handle enabling/disabling sharing for a note — only the owner can call this.

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/db";
import { nanoid } from "nanoid";

// POST /api/note/[id]/share - Create or update share link
// Owner generate a shareToken + set shareMode (EDIT or VIEW),, returns sharable link to FE
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
	const session = await getServerSession();

	if (!session?.user?.email) {
		return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
	}

	try {
		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
		});

		if (!user) {
			return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;
		const { mode } = await req.json(); // mode: "EDIT" | "VIEW"

		if (!["EDIT", "VIEW"].includes(mode)) {
			return NextResponse.json(
				{ success: false, error: "Invalid share mode" },
				{ status: 400 }
			);
		}

		// Verify ownership
		const note = await prisma.note.findUnique({ where: { id } });

		if (!note || note.ownerId !== user.id) {
			return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
		}

		// Generate or reuse share token
		const updatedNote = await prisma.note.update({
			where: { id },
			data: {
				shareToken: note.shareToken ?? nanoid(12), // Generate a new token if it doesn't exist randomly
				shareMode: mode,
			},
		});

		const shareLink = `${process.env.NEXT_PUBLIC_BASE_URL}/notes/shared/${updatedNote.shareToken}`;

		return NextResponse.json({
			success: true,
			data: {
				noteId: updatedNote.id,
				shareLink,
				mode: updatedNote.shareMode, // "EDIT" | "VIEW"
			},
		});
	} catch (error) {
		console.error("POST /api/note/[id]/share error:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}

// DELETE /api/note/[id]/share - Disable sharing for a note by the owner
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
	const session = await getServerSession();

	if (!session?.user?.email) {
		return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
	}

	try {
		const user = await prisma.user.findUnique({
			where: { email: session.user.email },
		});

		if (!user) {
			return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
		}

		const { id } = await params;

		// Verify ownership
		const note = await prisma.note.findUnique({ where: { id } });

		if (!note || note.ownerId !== user.id) {
			return NextResponse.json({ success: false, error: "Not authorized" }, { status: 403 });
		}

		// Remove shareToken and shareMode
		await prisma.note.update({
			where: { id },
			data: {
				shareToken: null,
				shareMode: null,
			},
		});

		return NextResponse.json({
			success: true,
			message: "Sharing disabled for this note",
		});
	} catch (error) {
		console.error("DELETE /api/note/[id]/share error:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}
