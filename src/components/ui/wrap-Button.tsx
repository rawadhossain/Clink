import React from "react";
import Link from "next/link";
import { ArrowRight, Sprout } from "lucide-react"; // Ensure Sprout is imported if you're using it in the parent component

import { cn } from "@/lib/utils"; // Assuming you have a utility for combining class names

interface WrapButtonProps {
	className?: string;
	children: React.ReactNode;
	href?: string;
}

export const WrapButton: React.FC<WrapButtonProps> = ({ className, children, href }) => {
	// Define common button styles
	const buttonBaseClasses = [
		"group",
		"cursor-pointer",
		"border-2",
		"border-transparent",
		"transition-all",
		"duration-500",
		"ease-out",
		"hover:border-green-500/50",
		"hover:shadow-lg",
		"hover:shadow-green-500/20",
		"bg-gradient-to-br",
		"from-gray-900",
		"via-gray-800",
		"to-gray-900",
		"gap-4",
		"h-[80px]",
		"sm:h-[90px]",
		"flex",
		"items-center",
		"p-[12px]",
		"rounded-full",
		"relative",
		"overflow-hidden",
	].join(" "); // Join with space if not directly passed to cn

	// Updated inner content styles with better dark theme and green accents
	const innerContentBaseClasses = [
		"h-[56px]",
		"sm:h-[68px]",
		"rounded-full",
		"flex",
		"items-center",
		"justify-center",
		"px-8",
		"sm:px-10",
		"text-white",
		"font-semibold",
		"text-lg",
		"relative",
		"z-10",
		"bg-gradient-to-r",
		"from-green-800",
		"to-emerald-500",
		"shadow-md",
		"hover:shadow-lg",
		// "hover:from-green-600",
		// "hover:to-emerald-600",
		"transition-all",
		"duration-300",
		"ease-in-out",
	].join(" ");

	// Define common arrow circle styles
	const arrowCircleBaseClasses = [
		"size-[40px]",
		"sm:size-[50px]",
		"flex",
		"items-center",
		"justify-center",
		"rounded-full",
		"bg-gradient-to-br",
		"from-green-600",
		"to-blue-500",
		"text-white",
		"group-hover:ml-5",
		"ease-in-out",
		"transition-all",
		"duration-300",
		"shadow-md",
		"group-hover:shadow-lg",
		"group-hover:shadow-blue-500/40",
		"relative",
		"z-10",
	].join(" ");

	return (
		<div className="flex items-center justify-center">
			{href ? (
				<Link href={href} passHref>
					<div className={cn(buttonBaseClasses, className)}>
						{/* Inner content container */}
						<div className={cn(innerContentBaseClasses)}>
							{children}
							{/* Enhanced gradient shimmer overlay on hover */}
							{/* <span className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 via-emerald-400/20 to-green-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}

							{/* Moving gradient shimmer effect */}
							{/* <span
								className={cn(
									"absolute inset-0 rounded-full bg-[size:200%_auto]",
									"bg-gradient-to-r from-transparent via-green-400/30 to-transparent",
									"opacity-0 group-hover:opacity-100",
									"group-hover:animate-[shimmer_1.5s_infinite]",
									"transition-opacity duration-300"
								)}
							/> */}
						</div>

						{/* Animated Arrow Circle */}
						<div className={cn(arrowCircleBaseClasses)}>
							<ArrowRight
								size={24}
								className="group-hover:rotate-45 ease-in-out transition-all duration-300"
							/>
						</div>

						{/* Background subtle glow on hover */}
						<span className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500/20 via-blue-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
					</div>
				</Link>
			) : (
				<div className={cn(buttonBaseClasses, className)}>
					<div className={cn(innerContentBaseClasses)}>
						<span className="font-medium tracking-tight">
							{children ? children : "Get Started"}
						</span>
						{/* Enhanced gradient shimmer overlay on hover */}
						<span className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 via-emerald-400/20 to-green-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

						{/* Moving gradient shimmer effect */}
						<span
							className={cn(
								"absolute inset-0 rounded-full bg-[size:200%_auto]",
								"bg-gradient-to-r from-transparent via-green-400/30 to-transparent",
								"opacity-0 group-hover:opacity-100",
								"group-hover:animate-[shimmer_1.5s_infinite]",
								"transition-opacity duration-300"
							)}
						/>
					</div>
					<div className={cn(arrowCircleBaseClasses)}>
						<ArrowRight
							size={24}
							className="group-hover:rotate-45 ease-in-out transition-all duration-300"
						/>
						<span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
					</div>
					<span className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500/20 via-blue-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
				</div>
			)}
		</div>
	);
};
