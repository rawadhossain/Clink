"use client";

import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import DocumentCard from "@/components/Dashboard/DocumentCard";
import DocumentListItem from "@/components/Dashboard/DocumentListItem";
import Toolbar from "@/components/Dashboard/Toolbar";
import Navbar01Page from "@/components/navbar-01/navbar-01";
import { useEffect, useState } from "react";
import axios from "axios";
import { Note } from "@/lib/types";
import DotGrid from "@/components/DotGrid"; // import your DotGrid component
import Link from "next/link";

export default function DashboardPage() {
	const [noteData, setNoteData] = useState<Note[]>([]);
	const [view, setView] = useState<"grid" | "list">("grid");

	useEffect(() => {
		axios
			.get("/api/test")
			.then((response) => {
				if (response.data.success) {
					setNoteData(response.data.data);
				}
			})
			.catch((error) => {
				console.error("Failed to fetch notes:", error);
			});
	}, []);

	return (
		<div className="relative min-h-screen">
			{/* Dashboard Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				<Toolbar currentView={view} onViewChange={setView} />

				{view === "grid" ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
						{noteData.length > 0 ? (
							noteData.map((doc) => (
								<Link
									key={doc.id}
									href={`/notes/${doc.id}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									<DocumentCard
										key={doc.id}
										id={doc.id}
										title={doc.title}
										content={doc.content}
										updatedAt={doc.updatedAt}
									/>
								</Link>
							))
						) : (
							<p>No documents to display.</p>
						)}
					</div>
				) : (
					<div className="mt-4 space-y-2">
						{/* Header for the list view */}
						<div className="flex items-center justify-between px-3 text-sm font-semibold text-gray-500">
							<p>Name</p>
							<div className="flex items-center gap-8">
								<p className="w-32 hidden md:block">Owner</p>
								<p className="w-48">Last Modified</p>
								<div className="w-5 h-5"></div>
							</div>
						</div>
						{noteData.map((doc) => (
							<DocumentListItem
								key={doc.id}
								id={doc.id}
								title={doc.title}
								owner="Me"
								lastModified={doc.updatedAt}
							/>
						))}
					</div>
				)}
			</main>
		</div>
	);
}
