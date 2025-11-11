import Navbar01Page from "@/components/navbar-01/navbar-01";
import { Toaster } from "@/components/ui/toaster";
import React from "react";
type Props = {
	children: React.ReactNode;
};
const layout = ({ children }: Props) => {
	return (
		<div>
			{/* <div className="sticky top-0">
				<Navbar01Page />
			</div> */}
			{children}
			<Toaster />
		</div>
	);
};

export default layout;
