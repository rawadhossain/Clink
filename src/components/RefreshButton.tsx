"use client";

import { motion } from "framer-motion";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";

const AnimatedRefreshButton = () => {
	const [isSpinning, setIsSpinning] = useState(false);

	const handleRefresh = () => {
		setIsSpinning(true);
		// Use a slight delay to allow the animation to be seen before the page reloads
		setTimeout(() => {
			window.location.reload();
		}, 800);
	};

	return (
		<motion.button
			onClick={handleRefresh}
			className="flex items-center justify-center p-2 rounded-full bg-teal-500 text-white shadow-lg cursor-pointer hover:bg-emerald-600 transition-colors"
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.9 }}
		>
			<motion.div
				animate={{ rotate: isSpinning ? 360 : 0 }}
				transition={{
					duration: 0.8,
					ease: "linear",
					repeat: isSpinning ? Infinity : 0,
				}}
			>
				<RefreshCcw size={20} />
			</motion.div>
		</motion.button>
	);
};

export default AnimatedRefreshButton;
