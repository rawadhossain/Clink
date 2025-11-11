"use client";

import { LayoutGrid, List, PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../theme-toggle";
import AnimatedRefreshButton from "../RefreshButton";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ViewMode = "grid" | "list";

interface ToolbarProps {
	currentView: ViewMode;
	onViewChange: (view: ViewMode) => void;
}

export default function Toolbar({ currentView, onViewChange }: ToolbarProps) {
	const router = useRouter();

	const handleLogout = async () => {
		try {
			await signOut({
				redirect: false,
				callbackUrl: "/",
			});
			toast.success("Logged out successfully");
			router.push("/");
			router.refresh();
		} catch (error) {
			console.error("Logout error:", error);
			toast.error("Failed to log out. Please try again.");
		}
	};

	return (
		<div className="flex items-center justify-between px-8 py-4">
			<h2 className="text-xl font-semibold text-gray-700">Recent Notes</h2>
			<Button variant="destructive" onClick={handleLogout}>
				Log out
			</Button>
			<div className="flex items-center gap-2">
				{/* A more modern "Create New" button */}
				<AnimatedRefreshButton />
				<Button className="cursor-pointer flex items-center gap-2 px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
					<PlusCircle className="w-5 h-5" />
					Create New
				</Button>
				<div className="flex items-center border rounded-lg p-1 bg-gray-100 cursor-pointer">
					<button
						onClick={() => onViewChange("grid")}
						className={`cursor-pointer p-2 rounded-md ${
							currentView === "grid" ? "bg-white shadow-sm" : ""
						}`}
					>
						<LayoutGrid className="w-5 h-5 text-gray-600" />
					</button>
					<button
						onClick={() => onViewChange("list")}
						className={`cursor-pointer p-2 rounded-md ${
							currentView === "list" ? "bg-white shadow-sm" : ""
						}`}
					>
						<List className="w-5 h-5 text-gray-600" />
					</button>
				</div>
				<ThemeToggle />
			</div>
		</div>
	);
}
