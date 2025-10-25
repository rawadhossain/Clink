import { Search, Bell } from "lucide-react";

interface User {
	name: string;
	avatarUrl: string;
}

interface DashboardHeaderProps {
	user: User;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
	return (
		<header className="flex items-center justify-between p-4 border-b bg-white">
			<div className="flex items-center gap-4">
				{/* Replace with your app's logo */}
				<h1 className="text-2xl font-bold text-gray-800">NoteApp</h1>
			</div>
			<div className="flex-1 max-w-lg">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
					<input
						type="search"
						placeholder="Search notes..."
						className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			</div>
			<div className="flex items-center gap-4">
				<button className="p-2 rounded-full hover:bg-gray-100">
					<Bell className="w-6 h-6 text-gray-600" />
				</button>
				<img
					src={user.avatarUrl}
					alt={user.name}
					className="w-10 h-10 rounded-full cursor-pointer"
				/>
			</div>
		</header>
	);
}
