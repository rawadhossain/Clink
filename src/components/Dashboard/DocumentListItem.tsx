// components/DocumentListItem.tsx
import { MoreVertical, FileText } from "lucide-react";

interface DocumentListItemProps {
	id: string;
	title: string;
	owner: string;
	lastModified: string;
}

export default function DocumentListItem({ title, owner, lastModified }: DocumentListItemProps) {
	return (
		<div className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
			<div className="flex items-center gap-4">
				<FileText className="w-5 h-5 text-blue-500" />
				<p className="font-medium text-gray-800">{title}</p>
			</div>
			<div className="flex items-center gap-8">
				<p className="text-sm text-gray-500 w-32 hidden md:block">{owner}</p>
				<p className="text-sm text-gray-500 w-48">{lastModified}</p>
				<button className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-gray-100 transition-opacity">
					<MoreVertical className="w-5 h-5 text-gray-600" />
				</button>
			</div>
		</div>
	);
}
