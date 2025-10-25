import { Note } from "@/lib/types";
import { Eye, MoreVertical } from "lucide-react";
import React from "react"; // Import React to handle the event type

interface DocumentCardProps {
	id: string;
	title: string;
	ownerId?: string;
	updatedAt: string;
	content: string;
	thumbnailUrl?: string; // URL to a preview image
}

export default function DocumentCard({
	id,
	title,
	updatedAt,
	ownerId,
	content,
}: DocumentCardProps) {
	// This function will handle the click and stop it from reaching the <Link>
	const handleActionClick = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handlePreviewClick = (e: React.MouseEvent<HTMLElement>) => {
		handleActionClick(e);
		// TODO: Add your logic to show the preview dialog here
		console.log("Show preview for:", id);
	};

	const handleMoreOptionsClick = (e: React.MouseEvent<HTMLElement>) => {
		handleActionClick(e);
		// TODO: Add your logic to show a dropdown menu here
		console.log("Show more options for:", id);
	};

	return (
		<div className="group rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
			<div className="h-40 bg-gray-50 flex items-center justify-center">
				{/* The thumbnail image */}
				<img
					src={"/placeholder.jpg"} // Corrected path for public folder
					alt={title}
					className="object-cover w-full h-full"
				/>
			</div>
			<div className="p-4 bg-white">
				<h3 className="font-semibold text-gray-800 truncate">{title}</h3>
				<p className="text-sm text-gray-600 mt-1 line-clamp-2">{content}</p>
				<div className="flex items-center justify-between mt-2">
					<p className="text-sm text-gray-500">
						Opened {new Date(updatedAt).toLocaleString()}
					</p>

					<div className="flex items-center space-x-2">
						{/* It's better to wrap icons in buttons for accessibility */}
						<button
							onClick={handlePreviewClick}
							className="p-1 rounded-full hover:bg-gray-100"
						>
							<Eye className="w-5 h-5 text-purple-500 hover:text-purple-800 " />
						</button>

						<button
							onClick={handleMoreOptionsClick}
							className="p-1 rounded-full hover:bg-gray-100 transition-opacity"
						>
							<MoreVertical className="w-5 h-5 text-gray-600" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
