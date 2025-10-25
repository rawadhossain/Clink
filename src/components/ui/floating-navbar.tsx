"use client";

import { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { JSX } from "react/jsx-runtime";
import { Menu, SproutIcon, X } from "lucide-react"; // Importing icons for hamburger and close
import Link from "next/link";

export const FloatingNav = ({
	navItems,
	className,
}: {
	navItems: {
		name: string;
		link: string;
		icon?: JSX.Element;
	}[];
	className?: string;
}) => {
	const { scrollYProgress } = useScroll();
	const [visible, setVisible] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile menu

	useMotionValueEvent(scrollYProgress, "change", (current) => {
		if (typeof current === "number") {
			const direction = current! - scrollYProgress.getPrevious()!;
			if (scrollYProgress.get() < 0.05) {
				setVisible(false);
			} else {
				if (direction < 0) {
					setVisible(true);
				} else {
					setVisible(false);
					setMobileMenuOpen(false); // Close mobile menu when scrolling down
				}
			}
		}
	});

	return (
		<AnimatePresence>
			{/* Only one child should be rendered at a time */}
			{visible && (
				<motion.div
					initial={{
						opacity: 1,
						y: -100,
					}}
					animate={{
						y: visible ? 0 : -100,
						opacity: visible ? 1 : 0,
					}}
					transition={{
						duration: 0.3,
						ease: "easeInOut",
					}}
					className={cn(
						"flex max-w-fit fixed top-6 inset-x-0 mx-auto border border-gray-700/50 rounded-full bg-gray-900/80 backdrop-blur-md shadow-2xl shadow-black/20 z-[5000] px-4 py-2 sm:px-6 sm:py-3 items-center justify-between sm:justify-center", // Adjusted for space-between on mobile
						className
					)}
				>
					{/* Logo Section */}
					<div className="flex items-center space-x-2 pr-4 sm:border-r sm:border-gray-700/50">
						<div className="relative w-8 h-8">
							{/* <Image
								src="/public/images/giki-logo.png"
								alt="Giki Zero Logo"
								fill
								className="object-contain"
							/> */}
							{/* <Image
								height={42}
								width={42}
								src="/giki-logo.png"
								alt="Giki Zero Logo"
								className="object-contain"
							/> */}
							<SproutIcon className="w-8 h-8 text-green-400" />
						</div>
						<div className="flex flex-col">
							<span className="text-white font-bold text-sm md:text-base">
								Giki Zero
							</span>
							<span className="text-green-400 text-xs md:text-sm font-medium">
								Carbon Intelligence
							</span>
						</div>
					</div>

					{/* Hamburger Menu Icon for Mobile */}
					<div className="sm:hidden flex items-center">
						<button
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="text-gray-300 hover:text-green-400  focus:ring-inset rounded-md p-1"
							aria-label="Toggle mobile menu"
						>
							{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>

					{/* Navigation Items (Desktop) */}
					<nav className="hidden sm:flex items-center space-x-4 sm:space-x-6 pl-4">
						{navItems.map((navItem: any, idx: number) => (
							<a
								key={`link=${idx}`}
								href={navItem.link}
								className={cn(
									"relative text-gray-300 items-center flex space-x-2 hover:text-green-400 transition-colors duration-300 group"
								)}
							>
								<span className="text-sm font-medium">{navItem.name}</span>
								<div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-blue-400 group-hover:w-full transition-all duration-300" />
							</a>
						))}
						{/* CTA Button for Desktop */}
						<Link href="/dashboard">
							<button className="relative border border-gray-600/50 text-xs sm:text-sm font-medium text-white px-4 py-1.5 sm:px-6 sm:py-2 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 hover:from-green-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 group overflow-hidden ml-4">
								<span className="relative z-10">Get Started</span>
								<div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
								<span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-green-400 to-transparent h-px" />
							</button>
						</Link>
					</nav>
				</motion.div>
			)}

			{/* Mobile Menu Overlay */}
			<AnimatePresence>
				{mobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-x-0 top-20 mx-auto w-[calc(100%-2rem)] max-w-sm bg-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-lg shadow-lg z-[4999] p-4 flex flex-col items-center sm:hidden"
					>
						<nav className="flex flex-col space-y-4 w-full">
							{navItems.map((navItem: any, idx: number) => (
								<a
									key={`mobile-link=${idx}`}
									href={navItem.link}
									className="text-gray-200 text-lg py-2 text-center hover:text-green-400 transition-colors duration-300"
									onClick={() => setMobileMenuOpen(false)} // Close menu on item click
								>
									{navItem.name}
								</a>
							))}
							{/* CTA Button for Mobile Menu */}
							<Link href="/dashboard">
								<button className="relative border border-gray-600/50 text-base font-medium text-white px-6 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 hover:from-green-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 group overflow-hidden mt-4">
									<span className="relative z-10">Get Started</span>
									<div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
									<span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-green-400 to-transparent h-px" />
								</button>
							</Link>
						</nav>
					</motion.div>
				)}
			</AnimatePresence>
		</AnimatePresence>
	);
};
