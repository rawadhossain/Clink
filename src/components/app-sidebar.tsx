"use client";

import type * as React from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
	BarChart3,
	Home,
	Leaf,
	Settings,
	User,
	FileText,
	LogOut,
	ChevronDown,
	Calendar,
} from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

const navigationItems = [
	{
		title: "Dashboard",
		url: "/dashboard",
		icon: Home,
	},
	{
		title: "Track Emissions",
		url: "/survey",
		icon: Leaf,
	},
	{
		title: "Analytics",
		url: "/analytics",
		icon: BarChart3,
	},
	{
		title: "History",
		url: "/history",
		icon: Calendar,
	},
	{
		title: "Reports",
		url: "/reports",
		icon: FileText,
	},
	{
		title: "Profile",
		url: "/profile",
		icon: User,
	},
	{
		title: "Settings",
		url: "/settings",
		icon: Settings,
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { data: session } = useSession();
	const pathname = usePathname();

	return (
		<Sidebar variant="inset" collapsible="icon" {...props}>
			<SidebarHeader>
				<div className="flex items-center gap-2 px-4 py-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg">
						{/* <Leaf className="h-4 w-4" /> */}
						{/* <img src="/public/giki-logo.png" alt="Giki Zero Logo" className="h-4 w-4" /> */}
						<Image height={42} width={42} src="/giki-logo.png" alt="Giki Zero Logo" />
					</div>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-semibold">Giki Zero</span>
						<span className="truncate text-xs text-muted-foreground">
							Carbon Tracker
						</span>
					</div>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Navigation</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{navigationItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild isActive={pathname === item.url}>
										<Link href={item.url}>
											<item.icon className="h-4 w-4" />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									size="lg"
									className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								>
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage
											src={session?.user?.image || ""}
											alt={session?.user?.name || ""}
										/>
										<AvatarFallback className="rounded-lg">
											{session?.user?.name?.charAt(0) || "U"}
										</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold">
											{session?.user?.name || "User"}
										</span>
										<span className="truncate text-xs">
											{session?.user?.email}
										</span>
									</div>
									<ChevronDown className="ml-auto size-4" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
								side="bottom"
								align="end"
								sideOffset={4}
							>
								<DropdownMenuItem asChild>
									<Link href="/profile">
										<User className="mr-2 h-4 w-4 cursor-pointer" />
										Profile
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/settings">
										<Settings className="mr-2 h-4 w-4 cursor-pointer" />
										Settings
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
									<LogOut className="mr-2 h-4 w-4 cursor-pointer" />
									Log out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
