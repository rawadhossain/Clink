"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Note } from "@/lib/types";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const NotePage = () => {
	const [noteData, setNoteData] = useState<Note | null>(null);
	const params = useParams();

	const [shareableLink, setShareableLink] = useState<string | null>(null);

	// Fetch note data
	useEffect(() => {
		if (!params?.id) return;

		if (typeof window !== "undefined")
			setShareableLink(`${window.location.origin}/notes/${params.id}`);

		axios
			.get(`/api/test/${params.id}`)
			.then((response) => {
				if (response.data.success) {
					setNoteData(response.data.data);
				}
			})
			.catch((error) => {
				console.error("Failed to fetch note:", error);
			});
	}, [params?.id]);

	return (
		<div>
			{/* <ThemeToggle />
			<h1>NotePage</h1> */}
			{/* <SimpleEditor /> */}
			{noteData ? (
				<div>
					{/* <SimpleEditor /> */}
					<h1 className="text-3xl font-bold"> {shareableLink}</h1>
					<h2 className="text-xl font-bold">{noteData.title}</h2>
					<p className="mt-2">{noteData.content}</p>
					<p className="text-sm text-gray-500">
						Last updated: {new Date(noteData.updatedAt).toLocaleString()}
					</p>
				</div>
			) : (
				<p>No notes found.</p>
			)}
		</div>
	);
};

export default NotePage;
