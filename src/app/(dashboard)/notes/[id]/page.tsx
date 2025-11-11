"use client";

import { ShareDialog, SharePermission } from "@/components/ShareDialog";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";

export default function NotePage() {
	const params = useParams();
	const noteId = params?.id as string;

	const [note, setNote] = useState<any>(null);
	const [isShareOpen, setIsShareOpen] = useState(false);
	const [shareLink, setShareLink] = useState<string | null>(null);
	const [permission, setPermission] = useState<SharePermission>("view");
	const [isUpdating, setIsUpdating] = useState(false);

	// ✅ Fetch the note on load
	useEffect(() => {
		if (!noteId) return;
		axios
			.get(`/api/note/${noteId}`)
			.then((res) => {
				const noteData = res.data.data;
				setNote(noteData);

				if (noteData.shareToken) {
					setShareLink(
						`${process.env.NEXT_PUBLIC_BASE_URL}/notes/shared/${noteData.shareToken}`
					);
					setPermission(noteData.shareMode?.toLowerCase() || "view");
				}
			})
			.catch((err) => console.error("Error fetching note:", err));
	}, [noteId]);

	// ✅ Handle Share Button Click
	const handleShareClick = async () => {
		try {
			// Generate a new share link if not already present
			if (!shareLink) {
				const res = await axios.post(
					`/api/note/${noteId}/share`,
					{ mode: "VIEW" },
					{ withCredentials: true }
				);

				if (res.data.shareToken) {
					const generatedLink = `${process.env.NEXT_PUBLIC_BASE_URL}/notes/shared/${res.data.shareToken}`;
					setShareLink(generatedLink);
					setPermission(res.data.shareMode?.toLowerCase());
				}
			}

			// Open dialog
			setIsShareOpen(true);
		} catch (err) {
			console.error("Failed to create share link:", err);
		}
	};

	// ✅ Handle Permission Change
	const handlePermissionChange = async (newPermission: SharePermission) => {
		if (!noteId) return;
		setIsUpdating(true);

		try {
			const res = await axios.post(
				`/api/note/${noteId}/share`,
				{ mode: newPermission.toUpperCase() },
				{ withCredentials: true }
			);

			if (res.data.shareToken) {
				const updatedLink = `${process.env.NEXT_PUBLIC_BASE_URL}/notes/shared/${res.data.shareToken}`;
				setShareLink(updatedLink);
				setPermission(res.data.shareMode?.toLowerCase());
			}
		} catch (error) {
			console.error("Error updating share permission:", error);
		} finally {
			setIsUpdating(false);
		}
	};

	if (!note) return <div className="text-gray-400 p-8 flex justify-center">Loading note...</div>;

	return (
		<div className="min-h-screen bg-[#0d0d0d] text-white p-8">
			<div className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-3xl font-semibold">{note.title}</h1>
					<p className="text-gray-400 text-sm mt-1">noteId: {note.id}</p>
				</div>
				<Button
					onClick={handleShareClick}
					className="bg-white text-black hover:bg-gray-100"
				>
					<Share2 className="mr-2 h-4 w-4" />
					Share
				</Button>
			</div>

			<p className="text-lg leading-relaxed">{note.content}</p>

			{/* ✅ Show Dialog Only When Link Exists */}
			{shareLink && (
				<ShareDialog
					open={isShareOpen}
					onOpenChange={setIsShareOpen}
					shareLink={shareLink}
					permission={permission}
					onPermissionChange={handlePermissionChange}
					isUpdatingPermission={isUpdating}
				/>
			)}
		</div>
	);
}
